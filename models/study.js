const { Sequelize, DataTypes } = require("sequelize");

class Study extends Sequelize.Model {
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
            image: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            hashTag: {
                type: DataTypes.JSON,
                allowNull: false
            },
            endDate: {
                type: DataTypes.STRING,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            simple_content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            study_content: {
                type: DataTypes.JSON,
                allowNull: false
            },
            detail_content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            recom_content: {
                type: DataTypes.JSON,
                allowNull: false
            },
            Dday: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            join_people_id: {
                type: DataTypes.JSON,
                allowNull: true
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            underscored: false,
            modelName: 'Study',
            tableName: 'studys',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}

module.exports = Study;