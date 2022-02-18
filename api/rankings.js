const express = require('express');
const router = express.Router();
const models = require('../models/index')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Study Ranking of Yesterday
router.get('/studies', async (req, res, next) => { 
    try {
        let yesterday = new Date();
        yesterday.setUTCHours(0, 0, 0, 0);
        yesterday.setDate(yesterday.getDate() - 1);

        const ranking = await models.studyavgtime.findAll({
            attributes: ['study_id', 'avg_time' ],
            where: { date : { [Op.eq]: yesterday } },
            order: [['avg_time', 'DESC']],
            raw: true,
        })

        let index=1
        for( r of ranking ){ r['rank'] = index++ }

        res.send({"code":200, ranking})

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