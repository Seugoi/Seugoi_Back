const { Sequelize, DataTypes } = require("sequelize");

class JoinStudy extends Sequelize.Model {
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
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            study_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'studys',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            timestamps: true,
            createdAt: true, // 자동으로 created_at 생성
            updateAt: false,
            modelName: 'JoinStudy',
            tableName: 'joinstudys',
            paranoid: false, // 레코드를 삭제할 때 실제로 데이터베이스에서 삭제됨.
        });
    }
}

module.exports = JoinStudy;