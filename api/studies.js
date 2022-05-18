const express = require('express')
const router = express.Router()
const models = require('../models/index')
const { v4: uuidV4 } = require('uuid');
const Sequelize = require('sequelize');
const { Server } = require('socket.io');
const e = require('cors');
const Op = Sequelize.Op;

// 전체 study 조회
router.get('/', async (req, res, next) => {
    const studies = await models.study.findAll({
        attributes: ['id', 'leader', 'title', 'topic','target_time', 'member_number','penalty', 'is_recruit', 'info']
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

// study 모집 완료
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

// study 삭제
router.delete('/setting/:studyId', async (req, res, next) => {
    try{
        // delete study 
        const study = await models.study.destroy({
            where: { id: req.params.studyId }
        })
        res.send({"code":200})
    }catch(err){
        res.send({"code":400})
        console.log(err)
        next(err)
    }
})

// study 공부 시간 UPDATE
router.patch('/time/:addr', async (req, res, next) => {
    try {
        // find studyId from addr
        const studyId = await models.study.findAll({
            attribute: ['id'],
            where: {addr:req.params.addr}
        })

        // find today
        let today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // find studytime ( userId, studyId, today )
        const today_study = await models.studytime.findOne({
            where: { study_id: studyId[0].id , user_id: req.session.user.id, date: { [Op.eq]: today } }
        })
        
        console.log(today)

        // add
        let update_time = today_study.studytime + req.body.study_time

        // update studytime
        const result = await models.studytime.update(
            { studytime: update_time },
            { where : { idx: today_study.idx} }
        )
        
        // SUCCESS
        res.send({code: result})

    } catch(err){
        res.send({code:"400"})
        console.error(err);
        next(err);
    }
})

// study 공부 시간 확인
router.post('/time/:studyId', async (req, res, next) => {    
    try{
        const date = new Date(req.body.date);
        date.setUTCHours(0, 0, 0, 0);
        // studytime -> findAll -> study_id = req.params.studyId
        const user_studytime = await models.studytime.findAll({
            attributes: ['user_id', 'studytime'],
            where: {
                study_id: req.params.studyId,
                date: {
                    [Op.eq]: date 
                } 
            },
            order: [ 'user_id' ]
        })
        res.send({"code":200, user_studytime})
    } catch(err)
    {
        res.send({"code":400})
        console.log(err)
        next(err)
    }
})

// 
// Study board //
// 

// 해당 스터디의 게시글 목록
router.get('/:studyId/board', async(req, res, next) => {
    // post DB에서 study_id = {:studyId} 있는 모든 post 목록 (idx 순서대로) 
    const posts = await models.post.findAll({
        attributes: ['idx', 'user_id', 'study_id', 'date', 'title', 'content', 'comments']
    })
    console.log(posts)
    res.send(posts)
})

// 게시글 작성
router.post('/:studyId/board', async(req, res, next) => {
    // req.params.studyId
    // req.body.title
    // req.body.content

    if (req.session.user !== undefined){

           // NEW post

    // idx = 오름차순
    // user_id = req.session.user.id
    // study_id = req.params.studyId
    // date = server 에서 처리
    // title = req.body.title
    // content = req.body.content
    // comment = 0 (생성시 default)

        const new_post = await models.post.create({
            user_id: req.session.user.id ,
            study_id: req.params.studyId,
            date: new Date(),
            title: req.body.title,
            content: req.body.content
        })

        console.log(new_post) // for check
        res.send({code:"200", msg:"create_success"}) 
        // NEXT TO DO => REDIRECT !!
         
    }
    else{
        res.send({code:"400", msg:"login_first"})
    }
})

// 게시글 상세 화면
router.get('/:studyId/board/:idx', async(req, res, next) => {
    // post DB에서 idx={:idx} 인 post  전달
    try {
        // find post where idx= req.params.idx

        const post = await models.post.findOne({
            where: {    idx: req.params.idx     }
        })
    
        if (post == null){
            res.send({code:"400", msg:"nonexistent_post"}) 
        }
        else{
            // after -> in comment DB,  FIND_ALL : post_id={:idx}인 comment
            try{
                const comment = await models.comment.findAll({
                    attributes: ['user_id', 'content', 'date'],
                    where: {    post_id:  req.params.idx    },
                    order: ['idx']
                })

                console.log("comment")
                console.log(comment)   // for check

                res.send({post: post, comment: comment})

            }catch(err){
                console.error(err);
                next(err);
            }
        }
    }catch(err){
        console.error(err);
        next(err);
    }
})

// 게시글 수정
router.patch('/:studyId/board/:idx', async(req, res, next) => {
    
    // post DB에서 {:idx}인 post 에서 아래 사항

    // req.body.title
    // req.body.content
    
    // 수정
    if (req.session.user !== undefined){

        const post = await models.post.findOne({
            where: {    idx: req.params.idx     }
        })

        if (post.dataValues.user_id != req.session.user.id){
            // ACCESS ERROR
            res.send({code:"400", msg:"access_denied"}) 
        }
        else{
            try{
                const result = await models.post.update(
                    {   title: req.body.title,
                        content: req.body.content   },
                    { where :  {   idx : req.params.idx    }}
                )

                console.log(result)

                res.send({code:"200", msg:"update_success"}) 

            }catch(err){
                next(err)
            }
        }
 }
 else{
    res.send({code:"400", msg:"login_first"})
 }
})

// 게시글 삭제
router.delete('/:studyId/board/:idx', async(req, res, next) => {    
    // login first
    if (req.session.user !== undefined){
        
        // post DB idx로 게시글 찾기
        const post = await models.post.findOne({
            where: {    idx: req.params.idx     }
        })

        // 만약 post의 user_id == req.session.user.id 이면 게시글 삭제
        if (post.dataValues.user_id != req.session.user.id){
            // ACCESS ERROR
            res.send({code:"400", msg:"access_denied"}) 
        }
        else{
            // ACCESS OK
            try{
                const result = await models.post.destroy(
                    { where :  {   idx : req.params.idx    }}
                )
                res.send({code:"200", msg:"delete_success"}) 
            }catch(err){
                next(err)
            }
        }
    }
    else{
        // 그렇지 않다면, res.send("400","권한 없음")
        res.send({code:"400", msg:"login_first"})
    }
})

// 게시글 댓글 작성
router.post('/:studyId/board/:idx/comment', async(req, res, next) => {
    // - login 안하면 접근 불가
    if (req.session.user !== undefined){
        // user 가 해당 study 내부 인원인지 확인
        const check = await models.user_study.findOne({ 
            where: {
                user_id: req.session.user.id,
                study_id: req.params.studyId
            } 
        }) 
        
        // 댓글 작성
        if (check !== null){
            const new_comment = await models.comment.create({
                user_id: req.session.user.id,
                post_id: req.params.idx,
                content: req.body.content,
                date: new Date(),
            })
            
            console.log(new_comment)
            res.send({code:"200", msg:"success"})
        }
        else{
            // 접근 제어
            res.send({code:"400", msg:"access_denied"})             
        }           
    }
    else{
        res.send({code:"400", msg:"login_first"})
    }
})

// 게시글 댓글 수정
router.patch('/:studyId/board/:idx/comment/:number', async(req, res, next) => {
     // - login 안하면 접근 불가
     if (req.session.user !== undefined){

        // user가 작성한 댓글인지 확인
        const check = await models.comment.findOne({ 
            where: {
                idx: req.params.number,
                user_id : req.session.user.id
            } 
        })

        // 댓글 수정
        if (check !== null){
            const result = await models.comment.update(
                { content: req.body.content   },
                { where :  {   idx : req.params.number    }}
            )
            
            console.log(result)
            res.send({code:"200", msg:"success"})
        }
        else{
            // 접근 제어
            res.send({code:"400", msg:"access_denied"})  
        }
     }else{
        res.send({code:"400", msg:"login_first"})
    }
} )

// 게시글 댓글 삭제
router.delete('/:studyId/board/:idx/comment/:number', async(req, res, next) => {
    // - login 안하면 접근 불가
    if (req.session.user !== undefined){

        // user가 작성한 댓글인지 확인
        const check = await models.comment.findOne({ 
            where: {
                idx: req.params.number,
                user_id : req.session.user.id
            } 
        })

        // 댓글 삭제
        if (check !== null){
            try{
                const result = await models.comment.destroy(
                    { where :  {   idx : req.params.number    }}
                )
                res.send({code:"200", msg:"delete_success"}) 
            }catch(err){
                next(err)
            }
        }else{
            // 접근 제어
            res.send({code:"400", msg:"access_denied"})  
        }
    }
    else{
        res.send({code:"400", msg:"login_first"})
    }
})

// 스터디 leader
router.get('/:studyId/leader', async(req, res, next)=> {
    const who_is_leader = await models.study.findOne({ 
        where: {
            id: req.params.studyId, // req. body에 studyId 로 study id 넣어주기
        } 
    })

    if  (who_is_leader !== null){
        res.send({ code:"200", leader: who_is_leader.leader })  
    }
    else{
        res.send({code:"400", msg:"access_denied"})  
    }
})

// 벌금 정산
router.post('/:studyId/penalty', async(req, res, next) => {
     // user 가 해당 study leader인지 확인
     const check = await models.study.findOne({ 
        where: {
            id: req.params.studyId,
            leader: req.body.user_id, // post 에서 body 부분에 user_id 넣어주기
        } 
    })

    if (check !== null){ 
        const penalty_paid = await models.penalty.update(
            { total_penalty: 0   },
            { where :  {   user_id : req.body.penalty_user_id,
                                study_id : req.params.studyId    }}
        )
        res.send({code:"200", msg:"update_success"})  
    }        
    else{
        // 권한 없음
        res.send({code:"400", msg:"access_denied"})  
    }
})

module.exports = router;