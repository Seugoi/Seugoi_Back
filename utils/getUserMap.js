const { User } = require('../models');

// 유저
async function getUserMap(userIds) {
    const users = await User.findAll({
        where: { id: userIds }
    });

    return users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});
}

module.exports = { getUserMap };