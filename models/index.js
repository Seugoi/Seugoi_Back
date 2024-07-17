const Sequelize = require("sequelize");
const User = require("./users");
const Study = require("./study");
const JoinStudy = require("./joinStudy");
const ViewHistory = require("./viewHistory");
const ChatRoom = require("./chatRoom");
const UserChatRoom = require("./userChatRoom");
const Message = require("./message");
const TaskComment = require("./taskComment");
const LikeStudy = require("./likeStudy");

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
db.ViewHistory = ViewHistory;
db.ChatRoom = ChatRoom;
db.UserChatRoom = UserChatRoom;
db.Message = Message;
db.TaskComment = TaskComment;
db.LikeStudy = LikeStudy;

User.init(sequelize);
Study.init(sequelize);
JoinStudy.init(sequelize);
ViewHistory.init(sequelize);
ChatRoom.init(sequelize);
UserChatRoom.init(sequelize);
Message.init(sequelize);
TaskComment.init(sequelize);
LikeStudy.init(sequelize);

module.exports = db;
