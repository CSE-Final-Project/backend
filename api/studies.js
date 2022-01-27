const express = require('express')
const router = express.Router()
const models = require('../models/index')
const { v4: uuidV4 } = require('uuid');

// TODO ==> 향후 get은 필요없다
router.get('/', async (req, res, next) => {
    const studies = await models.study.findAll({})
    res.json(studies);
})

router.post('/', async (req, res, next) => {
    const new_study = await models.study.create({
        leader: req.body.user, // TODO ==> user의 email 저장 (로그인 후 user의 email을 어떻게 가져오는가)
        title: req.body.title,
        topic: req.body.topic,
        target_time: req.body.target_time,
        addr: uuidV4(),
        penalty: req.body.penalty,
        info: req.body.info,
    }).then(console.log())

    const user_join_study = await models.user_study.create({
        user_id: req.body.user,
        study_id: new_study.id
    })

    res.json(user_join_study);
})

module.exports = router;