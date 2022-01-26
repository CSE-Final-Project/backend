const express = require('express');
const router = express.Router();
const models = require('../models/index')

router.get('/', async (req, res, next) => {
    const users = await models.user.findAll({})
    res.json(users);
})

router.post('/', async (req, res, next) => {
    try{
        const new_user = await models.user.create({
            email: req.body.email,
            password: req.body.password,
        })
        res.json({success:true, data:new_user});
    } catch (err){
        console.error(err);
        next(err);
    }
})

module.exports = router;