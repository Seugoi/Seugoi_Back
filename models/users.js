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
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            birthday: {
                type: DataTypes.STRING,
                allowNull: false
            },
            job: {
                type: DataTypes.ENUM,
                values: ['학생', '교사', '회사원'],
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}

module.exports = User;