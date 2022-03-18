const Sequelize = require('sequelize');
module.exports= ((sequelize, DataTypes)=>{
    return sequelize.define(
        "comment",
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
            post_id:{
                type: Sequelize.BIGINT(11),
                allowNull: false,
            },
            content:{
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            date:{
                type: Sequelize.DATE,
                allowNull: false
            },
        },
        {
            timestamps: true
        })
    }
)