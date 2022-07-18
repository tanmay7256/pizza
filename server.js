require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expresslayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const path = require('path')
const port = process.env.PORT || 3000

// Database connection
const mongodburl = "mongodb://localhost/pizza";
mongoose.connect(mongodburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
// set-template
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
})
app.use(express.json())
app.use(flash())
app.use(expresslayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web.js')(app);

app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})