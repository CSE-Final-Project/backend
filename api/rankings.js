const express = require('express');
const router = express.Router();
const models = require('../models/index')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.get('/studies', async (req, res, next) => {
    
    try {
        let today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const top3 = await models.studytime.findAll({
            attributes: ['study_id', [Sequelize.literal(`SUM(studytime)`), 'study_time'] ],
            where: { date: { [Op.eq]: today } },
            group: ['study_id'],
            limit: 3
        })
    res.send({"code":200, top3})
    } catch(err){
        res.send({"code":400})
        console.log(err)
        next(err)
    }
})

router.get('/studies/weekly', async (req, res, next) => {
})

router.get('/studies/monthly', async (req, res, next) => {
})

router.get('/users', async (req, res, next) => {
})

module.exports = router;