const { Study } = require('../models');
const { getUserMap } = require('./getUserMap');
const { getViewCountMap } = require('./getViewCountMap');
const { getStudyImageUrl } = require('./getImageUrl');
const { getCurrentPercent } = require('./getCurrentPercent');

async function getStudyMap(studyIds) {
    const studies = await Study.findAll({
        where: { id: studyIds }
    });

    const userIds = studies.map(study => study.user_id);

    const userMap = await getUserMap(userIds);
    const viewCountMap = await getViewCountMap(studyIds);
    const percent = await getCurrentPercent(userIds, studyIds);

    return studies.reduce((acc, study) => {
        study.dataValues.image = getStudyImageUrl(study.image) || null;
        study.dataValues.user = userMap[study.user_id];
        study.dataValues.viewCount = viewCountMap[study.id] || 0;
        study.dataValues.percent = percent[study.user_id, study.id];
        acc[study.id] = study;
        return acc;
    }, {});
}

module.exports = { getStudyMap };