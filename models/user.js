// user 정보
// 1. ID (email)
// 2. PW
const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "user",
        {
            email:{
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(40),
                allowNull: false,
            }
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)
    