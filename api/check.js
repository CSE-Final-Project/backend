const express = require('express')
const router = express.Router()
const models = require('../models/index')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');

const nodeschedule = require('node-schedule');
// const rule = '0 59 23 * * *'
// var target= new Date(0);
// target.setHours(0,0,0,0);

// Study Attendance Check API - test1
router.get('/', async (req, res, next) => {

    let query =
     `SELECT * FROM studytimes
            JOIN studies
            ON studytimes.study_id = studies.id`
            
    const studytime = await models.sequelize.query(
        query,
        { type: QueryTypes.SELECT,
        raw: true
        }
    )
    res.send(studytime)
    console.log(studytime)
})

module.exports = router;

// nodeschedule.scheduleJob(rule, function(){
// 	// DB studytime
//     // for i in studytime 
//     //      target_time = findOne( study.target_time,  where i.study_id == study.id )
//     //      if i.studytime >= target_time
//     //          DB attendance
//     //          new ( studytime.user_id, studytime_study_id, date(now), attendance(1))
//     const studytime = await models.studytime.findAll({
//         include: [{
//             models: models.study,
//             as: 'study',
//             attributes: ['target_time']
//         }],
//         where: {
//             studytime:{
//                 [Op.gt]: target_time,
//             }
//         }
//     })

// })

// Penalty Check