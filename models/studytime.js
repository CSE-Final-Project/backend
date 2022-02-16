const Sequelize = require('sequelize');
module.exports= ((sequelize, DataTypes)=>{
    return sequelize.define(
        "studytime",
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
            studytime:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            date:{
                type: Sequelize.DATE, //DATEONLY
                allowNull: false
            }
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)