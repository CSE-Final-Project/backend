const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "penalty",
        {
            id:{

            },
            date: {

            },
            user_id: {

            },
            study_id: {

            },
            penalty: {

            },
            is_paid: {
                
            }
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)
    