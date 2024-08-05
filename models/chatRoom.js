const { Sequelize, DataTypes } = require("sequelize");

class Chatroom extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: "varchar(100)",
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW, // timestampe 시각을 현재로 설정
        },
      },
      {
        sequelize,
        modelName: "ChatRoom",
        tableName: "chat_rooms",
        timestamps: false,
        paranoid: false,
      }
    );
  }
}

module.exports = Chatroom;
