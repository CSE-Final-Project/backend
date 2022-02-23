const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Http
const http = require('http') //
const server = http.createServer(app)

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
app.use('/api/rankings', require('./api/rankings'));
app.use('/', require('./api/test'));

// Socket IO
const io = require('socket.io')(server, {
    cors: {
        origin: "https://nudo.ml:8000", //
        methods: ["GET","POST"]
    }
})
require("./socket.js")(io);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN | "https://nudo.ml:8000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
}))

const schedule = require('node-schedule');
const { QueryTypes } = require('sequelize');

// Studytime Initialize
const studytime_init_time = '55 12 * * *'
const studytime_init = schedule.scheduleJob(studytime_init_time, async () => {
    let query =
    `SELECT user_id, study_id FROM user_studies`

    const user_studies = await models.sequelize.query(query,{type: QueryTypes.SELECT})

    const t = new Date()
    t.setUTCHours(0, 0, 0, 0)

    for (i of user_studies){
        await models.studytime.create({
            user_id: i.user_id,
            study_id: i.study_id,
            studytime: 0,
            date: t
        })
    }
})

// Attendance Check + Penalty Update
const attendance_check_time = '41 41 16 * * *'
const attendance_check = schedule.scheduleJob(attendance_check_time, async () => {
    let query =
    `SELECT user_id, study_id, target_time, studytime FROM studytimes
            JOIN studies ON studytimes.study_id = studies.id
            WHERE Date(studytimes.date) = CURDATE()`
        
    const studytime = await models.sequelize.query(query,{type: QueryTypes.SELECT})
    const t = new Date()

    for (i of studytime){
        if ( i.target_time <= i.studytime ){
            // Attendance
            await models.attendance.create({
                user_id: i.user_id,
                study_id: i.study_id,
                date: t,
                attendance: 0
            })
        }
        else {
            // Absent
            await models.attendance.create({
                user_id: i.user_id,
                study_id: i.study_id,
                date: t,
                attendance: 1
            })
            // Penalty
            const study_penalty = await models.study.findOne({
                attribute: ['penalty'],
                where: { id: i.study_id }
            })
            const before = await models.penalty.findOne({
                attribute: ['total_penalty'],
                where: { user_id: i.user_id, study_id: i.study_id }
            })
            // update
            await models.penalty.update(
                { total_penalty: study_penalty.penalty + before.total_penalty },
                { where: { user_id: i.user_id, study_id: i.study_id } }
            )
        }
    }
})

// Port setting
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
server.listen(process.env.PORT || 8000, () => console.log('server port 8000'));

