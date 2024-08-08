const { Study } = require('../models');
const { getUserMap } = require('./getUserMap');
const { getViewCountMap } = require('./getViewCountMap');
const { getStudyImageUrl } = require('./getImageUrl');

async function getStudyMap(studyIds) {
    const studies = await Study.findAll({
        where: { id: studyIds }
    });

    const userIds = studies.map(study => study.user_id);

    const userMap = await getUserMap(userIds);
    const viewCountMap = await getViewCountMap(studyIds);

    return studies.reduce((acc, study) => {
        study.dataValues.image = getStudyImageUrl(study.imagePath) || null;
        study.dataValues.user = userMap[study.user_id];
        study.dataValues.viewCount = viewCountMap[study.id] || 0;
        acc[study.id] = study;
        return acc;
    }, {});
}

module.exports = { getStudyMap };