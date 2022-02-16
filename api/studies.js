const express = require('express')
const router = express.Router()
const models = require('../models/index')
const { v4: uuidV4 } = require('uuid');
const Sequelize = require('sequelize');
const { route } = require('./users');
const { sequelize } = require('../models/index');
const Op = Sequelize.Op;

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

// study 시작
router.get('/do/:studyId', async (req,res,next) => {
    try {
        // Check login
        if (req.session.user !== undefined){
             // Check (userId, studyId) in user_study table
             const check = await models.user_study.findOne({ 
                where: {
                    user_id: req.session.user.id,
                    study_id: req.params.studyId
                } 
            }) 
            
            if (check !== null){
                // if there is, find study_addr in study table
                const study = await models.study.findOne({
                    where:{
                        id: req.params.studyId
                  }
                })
                
                // app.js -> Studytime Initialize
                // const today = new Date()
                // today.setUTCHours(0, 0, 0, 0)

                // const check2 = await models.studytime.findOne({ 
                //     where: {
                //         user_id: req.session.user.id,
                //         study_id: req.params.studyId,
                //         date: today,
                //     }
                // })

                // if (check2 == null){
                //     // set studytime to 0
                //     await models.studytime.create({
                //         user_id: req.session.user.id,
                //         study_id: req.params.studyId,
                //         studytime: 0,
                //         date: today,
                //     })
                // }
                
                // redirect user to there
                res.send({code:"200", msg:"redirect_to_studyroom", addr:study.addr})
            }
            else{
                res.send({code:"400", msg:"access_denied"})
            }            
        }
        else{
            res.send({code:"400", msg:"login_first"})
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
})

// study mate 조회
router.get('/mates/:studyId', async (req, res, next) => {
    try {
        // find user_id where study_id is studyID in user_study table
        
        const mates = await models.user_study.findAll({
            attribute: ['user_id'],
            where: {
                study_id: req.params.studyId
            }
        }).then(accounts => accounts.map(account => account.user_id));
        
        if (mates.length == 0){
            // error1 - nonexistent study ID
            res.send({code:"400", msg:"nonexistent_study"}) 
        }
        else{
            // result: success
            res.send(mates)
        }
    }catch(err){
        console.error(err);
        next(err);
    }

})

// study 출석 확인
router.post('/attendance/:studyId', async (req, res, next) => {
    try {
        // ( day, userID, attendance ) <- ( studyId (addr), week (body) )
        // from attendance DB
        const date = new Date(req.body.date);

        const sevenDaysAgo = new Date(new Date().setDate(date.getDate() - 7));        

        const atd = await models.attendance.findAll({
            attributes: ['user_id', 'date', 'attendance'],
            where: {
                study_id: req.params.studyId,
                date: {
                    [Op.gt]: sevenDaysAgo,
                    [Op.lte]: date 
                } 
            },
            order: ['date','user_id' ]
        })

        res.send(atd)
        
    } catch(err){
        console.error(err);
        next(err);
    }
})

// study 벌금 확인
router.get('/penalty/:studyId', async (req, res, next)=> {
    try {
        // studyId 로 penalty DB에서 ( user_id, penalty ) 가져오기
        const penalties = await models.penalty.findAll({
            attributes: ['user_id','total_penalty'],
            where: {
                study_id: req.params.studyId,
            },
            order: ['user_id' ]
        })

        res.send(penalties)

    } catch(err){
        console.error(err);
        next(err);
    }
})

// study 공부 시간 UPDATE
router.post('/time/:addr', async (req, res, next) => {
    try {
        // find studyId from addr
        const studyId = await models.study.findOne({
            where: {addr:req.params.addr}
        })

        // find today
        let today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // find studytime ( userId, studyId, today )
        const today_study = await models.studytime.findOne({
            where: { study_id: studyId.id , user_id: req.session.user.id, date: { [Op.eq]: today } }
        })
        
        // add
        let update_time = today_study.studytime + req.body.study_time

        // update studytime
        const result = await models.studytime.update(
            { studytime: update_time },
            { where : { idx: today_study.idx} }
        )
        
        // SUCCESS
        res.send({code:"200"})

    } catch(err){
        res.send({code:"400"})
        console.error(err);
        next(err);
    }
})

router.get('/completed/:studyId', async (req, res, next) => {
    try {
        // fineOne by studyId from study
        const completed = await models.study.update(
            {
                is_recruit: 0,
                date_start: new Date()
            },
            { where: { id: req.params.studyId } })
        // penalty create ( user_id, study_id, penalty = 0 )
        const users = await models.user_study.findAll({
            attribute: ['user_id'],
            where: { study_id: req.params.studyId }
        })
        for (u of users){
            await models.penalty.create({
                user_id: u.user_id,
                study_id: req.params.studyId,
                total_penalty: 0
            })
        }
        res.send({code:"200"})
    } catch(err){
        res.send({code:"400"})
        console.log(err)
        next(err)
    }
})
module.exports = router;