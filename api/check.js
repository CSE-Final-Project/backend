const express = require('express')
const router = express.Router()
const models = require('../models/index')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');

const nodeschedule = require('node-schedule');
const { range } = require('express/lib/request');
const study = require('../models/study');


// Study Attendance Check API - test2 ( NEXT TO DO => USE NODE-SCHEDULE )
router.get('/', async (req, res, next) => {

    const rule = '0 59 23 * * *'
    var target= new Date(0);
    target.setHours(0,0,0,0);

    let query =
     `SELECT * FROM studytimes
            JOIN studies ON studytimes.study_id = studies.id
            WHERE studies.target_time <= studytimes.studytime`
            
    const studytime = await models.sequelize.query(
        query,
        { type: QueryTypes.SELECT,
        raw: true
        }
    ).then(accounts => accounts.map(account => [account.user_id, account.study_id, account.date ]));
    
    for (i of studytime){
        const attendance = await models.attendance.create({
            user_id: i[0],
            study_id: i[1],
            date: new Date(),
            attendance: 1
        })
    }
})

module.exports = router;
// Penalty Check