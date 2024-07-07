const { Sequelize, DataTypes } = require("sequelize");

class Message extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrerment: true,
          primaryKey: true,
        },
        chat_room_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "chat_rooms",
            key: "id",
          },
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        sent_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: "Message",
        tableName: "message",
        timestamps: false,
      }
    );
  }
}

module.exports = Message;
