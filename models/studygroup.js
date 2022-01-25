const Sequelize = require('sequelize');
module.exports = ((sequelize, DataTypes)=>{
    return sequelize.define(
        "studygroup",
        {
            id:{
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            leader: { // user-email
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            target_time: {

            },
            addr: {

            },
            member_number: {

            },
            penalty: {

            },
            date_created: {

            },
            is_recruit: {

            },
            info: {

            },
        },
        {
            timestamps: true,
            paranoid: true,
        })
    }
)
    