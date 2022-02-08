const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "user",
        {
            idx:{ // PK
                type: Sequelize.BIGINT(11),
                autoIncrement: true,
                primaryKey: true,
            },
            id:{
                type: Sequelize.STRING(40),
                primaryKey: true,
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
    