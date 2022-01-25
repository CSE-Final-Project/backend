const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "studylog",
        {
            id:{

            },
            user_id: {

            },
            study_id: {

            },
            start_time: {

            },
            end_time: {

            },
            time: {
                
            }
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)
    