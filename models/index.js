const Sequelize = require("sequelize");
const User = require("./users");
const Study = require("./study");
const JoinStudy = require("./joinStudy");
const ViewHistory = require("./viewHistory");
const Chatroom = require("./chatroom.js");
const UserChatroom = require("./userChatroom.js");
const Message = require("./message");
const TaskComment = require("./taskComment");
const LikeStudy = require("./likeStudy");
const Notice = require("./notice");

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
db.Chatroom = Chatroom;
db.UserChatroom = UserChatroom;
db.Message = Message;
db.TaskComment = TaskComment;
db.LikeStudy = LikeStudy;
db.Notice = Notice;




User.init(sequelize);
Study.init(sequelize);
JoinStudy.init(sequelize);
ViewHistory.init(sequelize);
Chatroom.init(sequelize);
UserChatroom.init(sequelize);
Message.init(sequelize);
TaskComment.init(sequelize);
LikeStudy.init(sequelize);
Notice.init(sequelize);


User.belongsToMany(Chatroom, { through: UserChatroom, foreignKey: 'user_id' });
Chatroom.belongsToMany(User, { through: UserChatroom, foreignKey: 'chat_room_id' });
Chatroom.hasMany(Message, { foreignKey: 'chat_room_id' });
Message.belongsTo(Chatroom, { foreignKey: 'chat_room_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

module.exports = db;
