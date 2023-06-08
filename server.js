require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expresslayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session') // to use session
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session) //to store session in database its like a predefined schema 
const path = require('path')
const passport = require('passport')
const port = process.env.PORT || 3000
const Emitter = require('events')
// Database connection
const mongodburl = process.env.mongodburl;
mongoose.connect(mongodburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).on('error', (err) => {
    console.log('Connection failed...')
    console.log(err)
});

// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

app.use(session({
    secret: process.env.secret_key,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

// Passport config y hmesha sessions k baad hi hona chaiye 
app.use(passport.initialize())
app.use(passport.session())
const passportInit = require('./app/config/passport')
passportInit(passport)



// set-global middlewares so that they can be accessed everwhere in the frontend 
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

// jo bhi hm use krke likh re hain vo hm middle wares use kr rhe hain 
app.use(express.json())
app.use(flash())
app.use(expresslayout)
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web.js')(app);

app.use(express.static('public'));
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Join
    // console.log("joined")
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    // console.log(data)
    io.to('adminRoom').emit('orderPlaced', data)
})