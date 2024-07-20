const { ViewHistory, Study, sequelize } = require('../models');

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
        const user_id = Number(req.params.user_id);

        const views = await ViewHistory.findAll({
            attributes: ['user_id', 'study_id', 'createdAt'],
            where: {
                user_id: user_id
            },
            order: [['createdAt', 'DESC']]
        });

        if(views.length === 0) {
            return res.status(200).json({ message: "조회한 스터디가 없습니다." });
        }

        const studyId = views.map(view => view.study_id);
        const studies = await Study.findAll({
            attributes: [
                'id', 'user_id',
                'name', 'image', 'category',
                'endDate', 'title', 
                'simple_content', 
                'study_content', 
                'detail_content', 
                'recom_content',
                'Dday',
                'join_people_id'
            ],
            where: {
                id: studyId
            }
        });

        const studyMap = studies.reduce((acc, study) => {
            acc[study.id] = study;
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

        const response = views.map(view => ({
            ...view.dataValues,
            study: studyMap[view.study_id],
            viewCount: viewCountMap[view.study_id] || 0
        }));

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 본 스터디 조회 실패" });
    }
}