const { User, Study, ViewHistory, LikeStudy } = require('../models');

// 스터디 좋아요 누르기
exports.LikeStudy = async (req, res) => {
    try {
        const {
            user_id, study_id
        } = req.body;

        // 이미 좋아요를 눌렀는지 확인
        const existingLike = await LikeStudy.findOne({
            where: {
                user_id,
                study_id
            }
        });

        if (existingLike) {
            // 이미 좋아요를 눌렀다면, 좋아요를 취소 (삭제)
            const del = await LikeStudy.destroy({
                where: {
                    user_id,
                    study_id
                }
            });

            return res.status(200).json({ message: "스터디 좋아요 취소 성공" });
        } else {
            // 좋아요를 누르지 않았다면, 좋아요 추가
            const like = await LikeStudy.create({
                user_id,
                study_id
            });
            return res.status(200).json({ message: "스터디 좋아요 성공" });
        }

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 스터디 좋아요 실패" });
    }
}