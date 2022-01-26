const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "user",
        {
            id:{
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },           
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
    