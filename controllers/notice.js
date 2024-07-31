const { User, Notice } = require("../models");
const { getUserMap } = require('../utils/getUserMap');

// 공지 생성
exports.createNotice = async (req, res) => {
    try {
        const {
            user_id, study_id, title, content
        } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const createNotice = await Notice.create({
            user_id: Number(user_id),
            study_id,
            title,
            content
        });

        return res.status(201).json({ message: "공지가 성공적으로 생성되었습니다." });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 공지가 생성되지 않습니다." });
    }
}

// 스터디별 모든 공지 조회
exports.studyAllNotice = async (req, res) => {
    const studyIds = req.params.study_id;

    try {
        const notices = await Notice.findAll({
            attributes: ['id', 'user_id', 'study_id', 'title', 'content'],
            where: {
                study_id: studyIds
            }
        });

        const userIds = notices.map(notice => notice.user_id);
        const userMap = await getUserMap(userIds);

        const response = notices.map(notice => ({
            ...notice.dataValues,
            user: userMap[notice.user_id]
        }));

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 모든 공지 조회 실패" });
    }
}

// 특정 공지 조회
exports.idNotice = async (req, res) => {
    try {
        const notice_id = req.params.notice_id;

        const notice = await Notice.findOne({
            attributes: ['id', 'user_id', 'study_id', 'title', 'content'],
            where: {
                id: notice_id
            }
        })

        if (!notice) {
            return res.status(404).json({ error: "공지를 찾을 수 없습니다." });
        }

        // 사용자 정보를 조회
        const userMap = await getUserMap([notice.user_id]);

        const response = {
            ...notice.dataValues,
            user: userMap[notice.user_id]
        }

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 특정 과제 조회 실패" });
    }
}