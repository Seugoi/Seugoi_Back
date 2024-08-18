const { Sequelize, DataTypes } = require("sequelize");

class Task extends Sequelize.Model {
    static init(sequelize) {
        return super.init ({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                references:{
                    model : 'users',
                    key : 'id'
                }
            },
            study_id: {
                type: DataTypes.INTEGER,
                references:{
                    model : 'studies',
                    key : 'id'
                }
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            link: {
                type: DataTypes.STRING,
                allowNull: false
            },
            images: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            modelName: 'Task',
            tableName: 'task',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}

module.exports = Task;