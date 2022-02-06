const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const models = require("./models/index.js");
models.sequelize.sync().then( () => {
    console.log("DB conn");
}).catch(err => {
    console.log("DB n conn");
    console.log(err);
})

const session = require('express-session')
const FileStore = require('session-file-store')(session);
 
var fileStoreOptions = {path: './sessions/'};

// Session settings
app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

// app.get('/foo', function (req, res, next) {
//     if (req.session.num === undefined) {
//         req.session.num =1
//     }else{
//         req.session.num = req.session.num +1
//     }
//     res.send(`Views: ${req.session.num}`)
// })


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
app.use('/api/studies', require('./api/studies'));

// Port setting
var port = 3000;
app.listen(3000)