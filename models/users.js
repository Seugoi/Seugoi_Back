const { Sequelize, DataTypes } = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init ({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            kakao_id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            profile_img_url: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}

module.exports = User;