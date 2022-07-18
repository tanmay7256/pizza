const homecontroller = require('../app/http/homecontroller.js')
const logincontroller = require('../app/http/auth/logincontroller.js')
const registercontroller = require('../app/http/auth/registercontroller.js')
const cartcontroller = require('../app/http/customers/cartcontroller.js')

function inroutes(app) {
    app.get('/', homecontroller().index)

    app.get('/cart', cartcontroller().index)
    app.get('/login', logincontroller().login)
    app.get('/register', registercontroller().register)
    app.post('/update-cart', cartcontroller().update)
}

module.exports = inroutes

