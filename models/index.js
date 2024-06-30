const Sequelize = require('sequelize');
const User = require('./users');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "mysql",
    timezone: "Asia/Seoul",
    dialectOptions: {
        charset: "utf8mb4",
        dateStrings: true,
        typeCast: true,
    },
});

db.sequelize = sequelize;

db.User = User;

User.init(sequelize);

module.exports = db;