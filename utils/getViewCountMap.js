const { ViewHistory, sequelize } = require('../models');

// 조회수
async function getViewCountMap(studyIds) {
    const viewCounts = await ViewHistory.findAll({
        attributes: ['study_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where: {
            study_id: Number(studyIds)
        },
        group: ['study_id'],
        raw: true
    });

    return viewCounts.reduce((acc, viewCount) => {
        acc[viewCount.study_id] = viewCount.count;
        return acc;
    }, {});
}

module.exports = getViewCountMap;