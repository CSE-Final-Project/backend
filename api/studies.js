const express = require('express')
const router = express.Router()
const models = require('../models/index')
const { v4: uuidV4 } = require('uuid');

// 전체 study 조회
router.get('/', async (req, res, next) => {
    const studies = await models.study.findAll({
        attributes: ['id', 'leader', 'title', 'target_time', 'penalty', 'info']
    })
    console.log(studies)
    res.json(studies);
})

// study 생성 
router.post('/', async (req, res, next) => {
    // - login 안하면 접근 불가
    if (req.session.user !== undefined){

        const new_study = await models.study.create({
            id: req.body.study_id,
            leader: req.session.user.id, // (로그인 후 user의 id <- seesion)
            title: req.body.title,
            topic: req.body.topic,
            target_time: req.body.target_time,
            addr: uuidV4(),
            penalty: req.body.penalty,
            info: req.body.info,
        }).then(console.log())

        await models.user_study.create({
            user_id: req.session.user.id,
            study_id: new_study.id
        })

        res.send({code:"200", msg:"create_success"})
        //res.redirect('/api/studies/do/:studyId') study 생성 이후, redirect?
    }
    else{
        res.send({code:"400", msg:"login_first"})
    }
    
})

// study 가입
router.post('/join', async (req, res, next) => {
    // try-catch 안 쓰면 error
    try{
        console.log(req.body.study_id)
        // check the study is on going recruiting
        const is_recruit = await models.study.findAll({
            attribute: ['is_recruit'],
            where: {
                id: req.body.study_id
            }
        })
        
        if (is_recruit[0].is_recruit == true){
            // TODO => if I am already in study 

            const already_in = await models.user_study.findAll({
                attribute: ['study_id'],
                where: {
                    user_id: req.session.user.id,
                }
            }).then(accounts => accounts.map(account => account.study_id));

            if (already_in.includes(String(req.body.study_id))){
                res.send({code:"400", msg:"already_joined"});
            }
            else{
                // join me!
                const new_join = await models.user_study.create({
                    user_id: req.session.user.id,
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
                res.json({code:"200", msg:"join_success"});
            }
        }
        else{
            res.send({code:"400", msg:"already_full"});
        }
    } catch (err){
        console.error(err);
        next(err);
    }
})

// 참여 중인 study 조회
router.get('/join', async (req, res, next) => {
    try {
        // - login 안하면 접근 불가
        if (req.session.user !== undefined){
            // 참여 중인 study id
            const study_ids = await models.user_study.findAll({
                attribute: ['study_id'],
                where: {
                    user_id: req.session.user.id,
                }
            }).then(accounts => accounts.map(account => account.study_id));
            
            // study
            const studies = await models.study.findAll({
                attributes: ['id', 'leader', 'title', 'target_time', 'penalty', 'info'],
                where: {
                    id: study_ids
                }
            })
            res.json(studies);
        }
        else{
            res.send({code:"400", msg:"login_first"})
        }
    } catch (err){
        console.error(err);
        next(err);
    }
})

module.exports = router;