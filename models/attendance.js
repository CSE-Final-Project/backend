const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "attendance",
        {
            id:{

            },
            date: {

            },
            user_id: {

            },
            study_id: {

            },
            attendance: {
                
            }
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)
    