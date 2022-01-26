const express = require('express');
const router = express.Router();
const models = require('../models/index')

// Index
router.get('/', (req, res, next) => {
        models.user.findAll()
        .then( userResponse => {
        res.status( 200 ).json( userResponse )
        })
        .catch( error => {
        res.status( 400 ).send( error )
        })
    })

module.exports = router;