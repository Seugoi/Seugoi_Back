const { User, Notice } = require("../models");

// 공지 생성
exports.createNotice = async (req, res) => {
    try {
        const {
            user_id, title, content
        } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const createNotice = await Notice.create({
            user_id: Number(user_id),
            title: title,
            content: content
        });

        return res.status(200).json({ message: "공지가 성공적으로 생성되었습니다." });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 공지가 생성되지 않습니다." });
    }
}

// 모든 공지 조회
exports.allNotice = async (req, res) => {
    try {
        const notices = await Notice.findAll();

        const userIds = notices.map(notice => notice.user_id);
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

// 특정 과제 조회
exports.idNotice = async (req, res) => {
    try {
        const notice_id = req.params.notice_id;

        const notice = await Notice.findOne({
            attributes: [
                'id', 'user_id', 'title', 'content'
            ],
            where: {
                id: notice_id
            }
        })

        if (!notice) {
            return res.status(404).json({ error: "공지를 찾을 수 없습니다." });
        }

        // 사용자 정보를 조회
        const user = await User.findOne({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: notice.user_id
            }
        });

        const response = {
            ...notice.dataValues,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                birthday: user.birthday,
                job: user.job
            }
        }

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 특정 과제 조회 실패" });
    }
}

// 내가 쓴 공지 조회
exports.myNotice = async (req, res) => {
    try {
        const user_id = Number(req.params.user_id);

        const notices = await Notice.findAll({
            attributes: [
                'id', 'user_id', 'title', 'content'
            ],
            where: {
                user_id: user_id
            }
        })

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const userIds = notices.map(notice => notice.user_id);
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

        const response = notices.map(notice => ({
            ...notice.dataValues,
            user: userMap[notice.user_id]
        }))

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 내가 쓴 공지 조회 실패" });
    }
}