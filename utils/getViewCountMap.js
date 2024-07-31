const { ViewHistory, sequelize } = require('../models');

// 조회수
async function getViewCountMap(studyIds) {
    // studyIds가 배열일 경우
    const viewCounts = await ViewHistory.findAll({
        attributes: ['study_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where: {
            study_id: studyIds
        },
        group: ['study_id'],
        raw: true
    });

    return viewCounts.reduce((acc, viewCount) => {
        acc[viewCount.study_id] = parseInt(viewCount.count, 10);
        return acc;
    }, {});
}

module.exports = { getViewCountMap };