const Sequelize = require('sequelize');
module.exports= ((sequelize, DataTypes)=>{
    return sequelize.define(
        "penalty",
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
            total_penalty:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)