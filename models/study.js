const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "study",
        {
            idx:{ // PK
                type: Sequelize.BIGINT(11),
                autoIncrement: true,
                primaryKey: true,
            },
            id:{ // TO DO => UNIQUE
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            leader:{
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            topic: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            target_time: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            addr: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            member_number: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            },
            penalty: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            date_created: {
                type: DataTypes.DATE,
                defalutValue: Sequelize.literal('now()'),
            },
            is_recruit: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            info: {
                type: Sequelize.STRING(255),
            }
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)