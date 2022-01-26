const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const models = require("./models/index.js");

models.sequelize.sync().then( () => {
    console.log(" DB 연결 성공");
}).catch(err => {
    console.log("연결 실패");
    console.log(err);
})

// Other settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
})

// API
app.use('/api/users', require('./api/users'));

// Port setting
var port = 3000;
app.listen(3000)