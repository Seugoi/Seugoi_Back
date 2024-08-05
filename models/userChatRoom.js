const { Sequelize, DataTypes } = require("sequelize");

class UserChatroom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "users",
            key: "id",
          },
        },
        chat_room_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "chat_rooms",
            key: "id",
          },
        },
        joined_at: {
          type: DataTypes.DATE,
          defaltValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "UserChatRoom",
        tableName: "user_chat_room",
        timestamps: false,
        paranoid: false,
        primaryKey: ["user_id", "chat_room_id"],
        indexes: [
          {
            unique: true,
            fields: ["user_id", "chat_room_id"],
          },
        ],
      }
    );
  }
}

module.exports = UserChatroom;
