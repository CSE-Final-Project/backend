const express = require('express');
const router = express.Router();
const models = require('../models/index')

router.get('/', async (req, res, next) => {
    res.send("THIS IS NUDO BACKEND SERVER");
})


module.exports = router;

