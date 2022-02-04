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

router.post('/join', async (req, res, next) => {

    // check the study is on going recruiting
    const is_recruit = await models.study.findAll({
        attributes: ['is_recruit'],
        where: {
            id: req.body.study_id
        }
    })
    
    if (is_recruit[0].is_recruit == true){
        // TODO => if I am already in study 

        const already_in = await models.user_study.findAll({
            attributes: ['study_id'],
            where: {
                user_id: req.body.user_id
            }
        }).then(accounts => accounts.map(account => account.study_id));

        console.log(already_in)

        if (already_in.includes(String(req.body.study_id))){
            res.send({message: 'YOU ARE ALREADY IN STUDY'});
        }
        else{
            // join me!
            const new_join = await models.user_study.create({
                user_id: req.body.user_id,
                study_id: req.body.study_id
            })

            // update study_member
            const update = await models.study.increment(
                {member_number: 1},{ where: { id: req.body.study_id } });

            // if study_member is full then set is_recruit false!
            const check = await models.study.findAll({
                attributes: ['member_number'],
                where: {
                    id: req.body.study_id
                }
            })
            if (check[0].member_number >= 4){
                await models.study.update(
                    { is_recruit: false },
                    { where: { id: req.body.study_id} }
                )
            }
            res.json(new_join);
        }
    }
    else{
        res.send({message: 'STUDY IS ALREADY FULL'});
    }
})

router.get('/me', async (req, res, next) => {

    // show the study list
    const my_study_ids = await models.user_study.findAll({
        attributes: ['study_id'],
        where: {
            user_id: "dddd@bbbb.com"
        }
    }).then(accounts => accounts.map(account => account.study_id));

    console.log(my_study_ids)
    
    // send back res
    res.json(my_study_ids);
})

module.exports = router;