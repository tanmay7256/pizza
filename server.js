const express = require('express')
const app = express()
const ejs = require('ejs')
const expresslayout = require('express-ejs-layouts')
const path = require('path')
const port = process.env.PORT || 3000




// set-template
app.use(expresslayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/cart', (req, res) => {
    res.render('customers/cart')
})
app.get('/login', (req, res) => {
    res.render('auth/login')
})
app.get('/register', (req, res) => {
    res.render('auth/register')
})

app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})