const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs') //

// Https
const https = require('https') //
const server = https.createServer({
    key: fs.readFileSync('./private.pem'),
    cert: fs.readFileSync('./public.pem'),
    requestCert: false,
    rejectUnauthorized: false
}, app)

// DB
const models = require("./models/index.js");
models.sequelize.sync().then( () => {
    console.log("DB conn");
}).catch(err => {
    console.log("DB n conn");
    console.log(err);
})

// Session
const session = require('express-session')
const FileStore = require('session-file-store')(session); 
var fileStoreOptions = {path: './sessions/'};
app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

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

// Socket IO
const io = require('socket.io')(server, {
    cors: {
        origin: "https://10.200.148.175:3000", //
        methods: ["GET","POST"]
    }
})
require("./socket.js")(io);

app.use(cors({
    origin: 'https://10.200.148.175:3000', //
    credentials: true
}))

const schedule = require('node-schedule');
const { QueryTypes } = require('sequelize');

// Attendance Check
const attendance_check_time = '59 23 * * *'
const attendance_check = schedule.scheduleJob(attendance_check_time, async () => {
    let query =
    `SELECT user_id, study_id, target_time, date, studytime FROM studytimes
            JOIN studies ON studytimes.study_id = studies.id
            WHERE Date(studytimes.date) = CURDATE()`
        
    const studytime = await models.sequelize.query(
        query,
        {   type: QueryTypes.SELECT   }
    )

    for (i of studytime){
        if ( i.target_time > i.studytime ){
            // Attendance
            await models.attendance.create({
                user_id: i.user_id,
                study_id: i.study_id,
                date: i.date,
                attendance: 0
            })
        }
        else {
            // Absent
            await models.attendance.create({
                user_id: i.user_id,
                study_id: i.study_id,
                date: i.date,
                attendance: 1
            })
        }
    }
})

// Port setting
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
server.listen(process.env.PORT || 8000, () => console.log('server port 8000'));

