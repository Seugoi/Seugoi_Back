const Sequelize = require("sequelize");
const User = require("./users");
const Study = require("./study");
const JoinStudy = require("./joinStudy");
const ChatRoom = require("./chatRoom");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
    timezone: "+09:00",
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
    },
  }
);

db.sequelize = sequelize;

db.User = User;
db.Study = Study;
db.JoinStudy = JoinStudy;
db.ChatRoom = ChatRoom;

User.init(sequelize);
Study.init(sequelize);
JoinStudy.init(sequelize);
ChatRoom.init(sequelize);

module.exports = db;
