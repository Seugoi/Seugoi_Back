const { User, Study, LikeStudy, Notice, Task, sequelize } = require('../models');
const { getUserMap } = require('../utils/getUserMap');
const { getViewCountMap } = require('../utils/getViewCountMap');
const { getStudyImageUrl } = require('../utils/getImageUrl');
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

        const file = req.file;
        if (!file) {
            return res.status(400).send('파일이 업로드되지 않았습니다.');
        }

        // 스터디 생성
        const createstudy = await Study.create({
            user_id: user_id,
            image: file.filename ? file.filename : null,
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
        const studyIds = studies.map(study => study.id);

        const userMap = await getUserMap(userIds);
        const viewCountMap = await getViewCountMap(studyIds);

        const response = studies.map(study => {
            const imageUrl = study.image ? getStudyImageUrl(study.image) : null;

            return {
                ...study.dataValues,
                image: imageUrl,
                user: userMap[study.user_id],
                viewCount: viewCountMap[study.id] || 0,
            };
        });

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
                'id', 'user_id', 'name', 'image',
                'category', 'peopleNumber',
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

        const userMap = await getUserMap([study.user_id]);
        const viewCountMap = await getViewCountMap(study_id);
        const like = await LikeStudy.findOne({ where: { user_id: study.user_id, study_id } });
        const imageUrl = study.image ? getStudyImageUrl(study.image) : null;

        const response = {
            ...study.dataValues,
            image: imageUrl,
            user: userMap[study.user_id],
            viewCount: viewCountMap[study_id] || 0,
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

        const studies = await Study.findAll({
            attributes: [
                'id', 'user_id', 'image',
                'name', 'category', 'peopleNumber',
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
        if (studies.length === 0) {
            return res.status(200).json({ message: "검색 결과 없음" });
        }

        const userIds = studies.map(study => study.user_id);
        const studyIds = studies.map(study => study.id);

        const userMap = await getUserMap(userIds);
        const viewCountMap = await getViewCountMap(studyIds);

        const response = studies.map(study => {
            const imageUrl = study.image ? getStudyImageUrl(study.image) : null;

            return {
                ...study.dataValues,
                image: imageUrl,
                user: userMap[study.user_id],
                viewCount: viewCountMap[study.id] || 0,
            };
        });

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 검색된 스터디 조회 실패" });
    }
}

// 스터디별 과제와 공지 모두 조회(최신순) type으로 구분 => task, notice
exports.studyAllNoticeAndTask = async (req, res) => {
    try {
        // 과제 조회
        const tasks = await Task.findAll({
            attributes: ['id', 'user_id', 'study_id', 'title', 'description', 'createdAt'],
            where: { study_id: studyIds }
        });

        // 공지 조회
        const notices = await Notice.findAll({
            attributes: ['id', 'user_id', 'study_id', 'title', 'content', 'createdAt'],
            where: { study_id: studyIds }
        });

        const userIds = [
            ...new Set([
                ...notices.map(notice => notice.user_id),
                ...tasks.map(task => task.user_id)
            ])
        ];

        const userMap = await getUserMap(userIds);

        const combined = [
            ...notices.map(notice => ({
                ...notice.dataValues,
                type: 'notice',
                user: userMap[notice.user_id]
            })),
            ...tasks.map(task => ({
                ...task.dataValues,
                type: 'task',
                user: userMap[task.user_id]
            }))
        ];

        // 최신 순으로 정렬
        const sortedResponse = combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(sortedResponse);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 스터디별 과제와 공지 조회 실패" });
    }
}