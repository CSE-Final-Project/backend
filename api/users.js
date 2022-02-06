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
        res.json({success:true, data:new_user});
    } catch (err){
        console.error(err);
        next(err);
    }
})

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
        
        if (check_id.length != 0){
            // login id 존재
            const check_pw = ( check_id[0].password === password )
            if (check_pw == true) {
                // login 성공 ( session 저장 )
                req.session.user = {
                    id: id,
                    is_logined: true
                }
                res.send('LOGIN') // success code 200, 201
            }
            else {
                // login 실패 - id와 pw가 일치하지 않습니다
                res.send('id-pw 불일치') // fail code 400, 401
            }
        }
        else{
            res.send('존재하지 않는 id')
        }
    } catch (err){
        console.error(err);
        next(err);
    }
})

router.get('/logout', async (req, res, next) => {
    try{
        req.logout();
        req.session.destroy();
        res.redirect('/api/users');
    } catch (err){
        console.error(err);
        next(err);
    }
})
module.exports = router;