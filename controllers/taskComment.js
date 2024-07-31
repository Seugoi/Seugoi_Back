const { User, TaskComment } = require('../models');
const { getUserMap } = require('../utils/getUserMap');
const { getCommentImageUrl } = require('../utils/getImageUrl');

// 스터디 댓글 등록
exports.createComment = async (req, res) => {
    try {
        const {
            user_id, study_id, content
        } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send('파일이 업로드되지 않았습니다.');
        }

        const images = files ? files.map(file => file.filename) : [];

        const createcomment = await TaskComment.create({
            user_id: Number(user_id),
            study_id: Number(study_id),
            content,
            image: JSON.stringify(images)
        });


        return res.status(201).json({ message: '댓글이 성공적으로 달렸습니다.' });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 댓글이 달리지 않았습니다.' });
    }
}

// 댓글 모두 조회
exports.allTaskComment = async (req, res) => {
    try {
        const comments = await TaskComment.findAll();

        if (comments.length === 0) {
            res.status(200).json({ message: "현재 작성된 댓글이 없습니다." });
        }

        const userIds = comments.map(comment => comment.user_id);
        const userMap = await getUserMap(userIds);

        const response = comments.map(comment => {
            const images = comment.image ? JSON.parse(comment.image) : [];
            
            return {
                id: comment.id,
                user_id: comment.user_id,
                study_id: comment.study_id,
                content: comment.content,
                images: images.map(img => getCommentImageUrl(img)),
                user: userMap[comment.user_id]
            };
        });

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 모든 댓글 조회 실패" });
    }
}

// 스터디별 모든 댓글 조회
exports.idComment = async (req, res) => {
    try {
        const study_id = Number(req.params.study_id);
        const taskComment = await TaskComment.findAll({
            attributes: [
                'id', 'user_id', 'study_id',
                'content', 'image'
            ],
            where: {
                study_id: study_id
            }
        })

        if (taskComment.length === 0) {
            return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
        }

        // 댓글과 작성자 정보 조회
        const taskCommentsWithUser = await Promise.all(taskComment.map(async (taskComment) => {
            const userMap = await getUserMap([taskComment.user_id]);
            const images = taskComment.image ? JSON.parse(taskComment.image) : [];

            return {
                id: taskComment.id,
                user_id: taskComment.user_id,
                study_id: taskComment.study_id,
                content: taskComment.content,
                images: images.map(img => getCommentImageUrl(img)),
                user: userMap[taskComment.user_id]
            };
        }));

        res.status(200).json(taskCommentsWithUser);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 특정 댓글 조회 실패" });
    }
}