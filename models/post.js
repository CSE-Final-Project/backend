const Sequelize = require('sequelize');
module.exports= ((sequelize, DataTypes)=>{
    return sequelize.define(
        "post",
        {
            idx:{ // PK
                type: Sequelize.BIGINT(11),
                autoIncrement: true,
                primaryKey: true,
            },
            user_id:{
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            study_id:{
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            date:{
                type: Sequelize.DATE,
                allowNull: false
            },
            title:{
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            content:{
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            comments:{
                type: Sequelize.INTEGER ,
                allowNull: false,
                defaultValue: 0
            },
        },
        {
            timestamps: true
        })
    }
)