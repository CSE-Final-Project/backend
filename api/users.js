const read = require('body-parser/lib/read');
const express = require('express');
const router = express.Router();
const models = require('../models/index')

router.get('/', async (req, res, next) => {
    const users = await models.user.findAll({})
    res.json(users);
})
// 회원가입
router.post('/', async (req, res, next) => {
    try{
        const new_user = await models.user.create({
            id: req.body.id,
            password: req.body.password,
        })
        res.send({code:"200", msg:"create_success"});
    } catch (err){
        console.error(err);
        next(err);
    }
})
// 로그인
router.post('/login', async (req, res, next) => {
    try{
        var id = req.body.id;
        var password = req.body.password;

        const check_id = await models.user.findAll({
            attribute: ['password'],
            where: {
                id: req.body.id
            }
        })

        console.log('login', id, password)

        if (check_id.length != 0){
            // login id 존재
            const check_pw = ( check_id[0].password === password )
            if (check_pw == true) {
                // login 성공 ( session 저장 )
                req.session.user = {
                    id: id,
                    is_logined: true
                }
                res.send({code:"200", msg:"login", id:id})
            }
            else {
                // login 실패 - id와 pw가 일치하지 않습니다
                res.send({code:"400", msg:"mismatch"})
            }
        }
        else{
            // login 실패 - 존재하지 않는 id
            res.send({code:"400", msg:"nonexsist_id"})
        }
    } catch (err){
        console.error(err);
        next(err);
    }
})
// 로그아웃
router.get('/logout', async (req, res, next) => {
    try{
        console.log('logout', req.session.id)
        req.session.destroy();
        res.redirect('/api/users');
    } catch (err){
        console.error(err);
        next(err);
    }
})

// 참여 중인 study 조회
router.get('/studies', async (req, res, next) => {

    console.log('get /users/studies')
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