const { Task } = require('../models');

async function getCurrentPercent(userIds, studyIds) {
    const tasks = await Task.findAll({
        where: {
            user_id: userIds,
            study_id: studyIds
        }
    });

    const taskCount = {};
    const completedTaskCount = {};

    tasks.forEach(task => {
        if (!taskCount[task.study_id]) {
            taskCount[task.study_id] = 0;
            completedTaskCount[task.study_id] = 0;
        }
        taskCount[task.study_id]++;
        if (task.status) {
            completedTaskCount[task.study_id]++;
        }
    });

    const percentMap = {};

    const totalTasks = taskCount[studyIds] || 0;
    const completedTasks = completedTaskCount[studyIds] || 0;

    percentMap[studyIds] = totalTasks === 0 ? 0 : parseFloat(((completedTasks / totalTasks) * 100).toFixed(2));

    return percentMap;
}

module.exports = { getCurrentPercent };