const { User, Study } = require('../models');
const moment = require('moment');

// 스터디 생성
exports.createStudy = async (req, res) => {
    try {
        const {
            user_id, name, hashTag, 
            endDate, title, 
            simple_content, 
            study_content, 
            detail_content, 
            recom_content
        } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const parsedStudyContent = JSON.parse(study_content);
        const parsedRecomContent = JSON.parse(recom_content);
        const parsedHashTag = JSON.parse(hashTag);

        // endData 유효성 검사 및 변환
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
            user_id: Number(user_id),
            image: req.file ? req.file.originalname : null,
            name, title,
            hashTag: parsedHashTag,
            endData: extractedEndDate,
            simple_content,
            study_content: parsedStudyContent,
            detail_content,
            recom_content: parsedRecomContent,
            Dday: Dday
        });

        return res.status(200).json({ message: '스터디가 성공적으로 생성되었습니다.' });
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

        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        const response = studies.map(study => ({
            ...study.dataValues,
            user: {
                id: userMap[study.user_id].id,
                nickname: userMap[study.user_id].nickname,
                email: userMap[study.user_id].email,
                birthday: userMap[study.user_id].birthday,
                job: userMap[study.user_id].job
            }
        }));

        res.json(response);
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
                'id', 'user_id',
                'image',
                'endData', 'title', 
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

        if (!user) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }

        let response = {
            ...study.dataValues,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                birthday: user.birthday,
                job: user.job
            }
        };

        res.json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 특정 스터디 조회 실패" });
    }
}