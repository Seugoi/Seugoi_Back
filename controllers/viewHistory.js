const { ViewHistory } = require('../models');
const { getStudyMap } = require('../utils/getStudyMap');

// 스터디 조회
exports.viewStudy = async (req, res) => {
    try {
        const {
            user_id,
            study_id
        } = req.body;

        // view_history 테이블
        const view = await ViewHistory.create({
            user_id,
            study_id
        });

        res.status(200).json({ message: "스터디 보기 성공" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 스터디 보기 실패" });
    }
}

// 조회한 스터디 조회(최근순)
exports.viewedStudy = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const views = await ViewHistory.findAll({
            where: { user_id: user_id },
            order: [['createdAt', 'DESC']]
        });

        if(views.length === 0) {
            return res.status(200).json({ message: "조회한 스터디가 없습니다." });
        }

        const studyId = views.map(view => view.study_id);
        const studyMap = await getStudyMap(studyId);

        const response = views.map(view => {
            return {
                ...view.dataValues,
                study: studyMap[view.study_id],
            }
        });

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 본 스터디 조회 실패" });
    }
}