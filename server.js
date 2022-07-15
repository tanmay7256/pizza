const express = require('express')
const app = express()
const ejs = require('ejs')
const expresslayout = require('express-ejs-layouts')
const path = require('path')
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.render('home')
})


// set-template
app.use(expresslayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})