const { Sequelize, DataTypes } = require("sequelize");

class TaskComment extends Sequelize.Model {
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
                    model : 'studys',
                    key : 'id'
                }
            },
            content: {
                type: DataTypes.STRING,
                allowNull: true
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            modelName: 'TaskComment',
            tableName: 'task_comment',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}

module.exports = TaskComment;