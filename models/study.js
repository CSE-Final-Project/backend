const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "study",
        {
            id:{
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
                allowNull: false,
            },
            penalty: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            date_created: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            is_recruit: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            info: {
                type: Sequelize.STRING(40),
            }
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)