const { User, Study, ViewHistory, LikeStudy, sequelize } = require('../models');
const moment = require('moment');
const { Sequelize } = require('sequelize');

// 스터디 생성
exports.createStudy = async (req, res) => {
    try {
        let {
            user_id, name, category, peopleNumber,
            endDate, title, 
            simple_content, 
            study_content, 
            detail_content, 
            recom_content
        } = req.body;

        user_id = Number(user_id);
        peopleNumber = Number(peopleNumber);
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const parsedStudyContent = JSON.parse(study_content);
        const parsedRecomContent = JSON.parse(recom_content);
        const parsedcategory = JSON.parse(category);

        // endDate 유효성 검사 및 변환
        const momentEndDate = moment(endDate, 'YYYY-MM-DD', true);
        const extractedEndDate = momentEndDate.format('YYYY-MM-DD');
        if (!momentEndDate.isValid()) {
            return res.status(400).json({ error: '유효하지 않은 날짜 형식입니다.' });
        }

        // Dday 계산
        const currentDate = moment().startOf('day');
        const Dday = momentEndDate.diff(currentDate, 'days');

        // 스터디 생성
        const createstudy = await Study.create({
            user_id: user_id,
            image: req.file ? req.file.originalname : null,
            name, title,
            category: parsedcategory,
            peopleNumber,
            endDate: extractedEndDate,
            simple_content,
            study_content: parsedStudyContent,
            detail_content,
            recom_content: parsedRecomContent,
            Dday: Dday
        });

        return res.status(201).json({ message: '스터디가 성공적으로 생성되었습니다.' });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 스터디가 생성되지 않았습니다.' });
    }
};

// 모든 스터디 조회
exports.allStudy = async (req, res) => {
    try {
        const studies = await Study.findAll();

        const userIds = studies.map(study => study.user_id);
        const users = await User.findAll({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: userIds
            }
        });

        // 사용자 세부 정보를 사용자 ID로 매핑
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        // 조회 횟수 계산
        // 모든 스터디에 대한 조회 수 가져오기
        const viewCounts = await ViewHistory.findAll({
            attributes: ['study_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['study_id'],
            raw: true
        });

        // 조회 수를 스터디 ID로 매핑
        const viewCountMap = viewCounts.reduce((acc, viewCount) => {
            acc[viewCount.study_id] = viewCount.count;
            return acc;
        }, {});

        const response = studies.map(study => ({
            ...study.dataValues,
            user: userMap[study.user_id],
            viewCount: viewCountMap[study.id] || 0
        }));

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 모든 스터디 정보 조회 실패" });
    }
}

// 특정 스터디 조회
exports.idStudy = async (req, res) => {
    try {
        const study_id = req.params.study_id;

        const study = await Study.findOne({
            attributes: [
                'id', 'user_id', 'name',
                'image', 'category', 'peopleNumber',
                'endDate', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content',
                'Dday',
                'join_people_id'
            ],
            where: {
                id: study_id
            }
        })

        if (!study) {
            return res.status(404).json({ error: "스터디를 찾을 수 없습니다." });
        }

        // 사용자 정보를 조회
        const user = await User.findOne({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: study.user_id
            }
        });

        // 조회 횟수 계산
        const viewCount = await ViewHistory.count({
            where: {
                study_id: study_id
            }
        });

        // 좋아요 여부
        const like = await LikeStudy.findOne({
            where: {
                user_id: study.user_id,
                study_id: study_id
            }
        });

        let response = {
            ...study.dataValues,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                birthday: user.birthday,
                job: user.job
            },
            viewCount: viewCount || 0,
            liked: !!like
        };

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 특정 스터디 조회 실패" });
    }
}

// 검색된 스터디 조회
exports.keywordStudy = async (req, res) => {
    try {
        const keyword = req.params.keyword;

        let searchString = `%${keyword}%`;

        const study = await Study.findAll({
            attributes: [
                'id', 'user_id',
                'name', 'image', 'category', 'peopleNumber',
                'endDate', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content',
                'Dday',
                'join_people_id'
            ],
            where: {
                [Sequelize.Op.or]: [
                    sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), {
                        [Sequelize.Op.like]: searchString
                    }),
                    sequelize.where(sequelize.fn('LOWER', sequelize.cast(sequelize.col('category'), 'CHAR')), {
                        [Sequelize.Op.like]: searchString
                    })
                ]
            }
        })

        // 검색된 스터디가 없는 경우
        if (study.length === 0) {
            return res.status(200).json({ message: "검색 결과 없음" });
        }

        const userIds = study.map(study => study.user_id);
        const users = await User.findAll({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: userIds
            }
        });

        // 사용자 세부 정보를 사용자 ID로 매핑
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        // 조회 횟수 계산
        // 모든 스터디에 대한 조회 수 가져오기
        const viewCounts = await ViewHistory.findAll({
            attributes: ['study_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['study_id'],
            raw: true
        });

        // 조회 수를 스터디 ID로 매핑
        const viewCountMap = viewCounts.reduce((acc, viewCount) => {
            acc[viewCount.study_id] = viewCount.count;
            return acc;
        }, {});

        const response = study.map(study => ({
            ...study.dataValues,
            user: userMap[study.user_id],
            viewCount: viewCountMap[study.id] || 0
        }));

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 검색된 스터디 조회 실패" });
    }
}