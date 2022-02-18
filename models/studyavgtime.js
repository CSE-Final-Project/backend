const Sequelize = require('sequelize');
module.exports= ((sequelize, DataTypes)=>{
    return sequelize.define(
        "studyavgtime",
        {
            idx:{ // PK
                type: Sequelize.BIGINT(11),
                autoIncrement: true,
                primaryKey: true,
            },
            study_id:{
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            avg_time:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            date:{
                type: Sequelize.DATE,
                allowNull: false
            }
        },
        {
            timestamps: true
        })
    }
)