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
app.use('/api/check', require('./api/check'));

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

// Port setting
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
server.listen(process.env.PORT || 8000, () => console.log('server port 8000'));

