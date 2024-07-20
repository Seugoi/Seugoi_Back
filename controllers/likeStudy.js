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

// 내가 찜한 스터디 조회
exports.likedStudy = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        // 사용자가 좋아요를 누른 스터디 ID 목록 조회
        const likedStudies = await LikeStudy.findAll({
            attributes: ['study_id'],
            where: {
                user_id: user_id
            }
        });

        if (likedStudies.length === 0) {
            return res.status(200).json({ message: "좋아요를 누른 스터디가 없습니다." });
        }

        const studyIds = likedStudies.map(like => like.study_id);

        // 좋아요를 누른 스터디들의 세부 정보 조회
        const studies = await Study.findAll({
            attributes: [
                'id', 'user_id', 'name',
                'image', 'hashTag',
                'endDate', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content',
                'Dday',
                'join_people_id'
            ],
            where: {
                id: studyIds
            }
        });

        // 각 스터디의 작성자 정보와 조회 횟수 및 좋아요 여부 조회
        const response = await Promise.all(studies.map(async (study) => {
            const user = await User.findOne({
                attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
                where: {
                    id: study.user_id
                }
            });

            const viewCount = await ViewHistory.count({
                where: {
                    study_id: study.id
                }
            });

            return {
                ...study.dataValues,
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    birthday: user.birthday,
                    job: user.job
                },
                viewCount: viewCount || 0,
                liked: true
            };
        }));

        res.status(200).json(response);

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 찜한 스터디 조회 실패" });
    }
}