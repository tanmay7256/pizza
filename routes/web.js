const homecontroller = require('../app/http/controllers/homecontroller.js')
const logincontroller = require('../app/http/controllers/auth/logincontroller.js')
const registercontroller = require('../app/http/controllers/auth/registercontroller.js')
const cartcontroller = require('../app/http/controllers/customers/cartcontroller.js')
const ordercontroller = require('../app/http/controllers/customers/ordercontroller.js')
const statuscontroller = require('../app/http/controllers/admin/statuscontroller.js')
const adminordercontroller = require('../app/http/controllers/admin/ordercontroller.js')
const guest = require('../app/http/middlewares/guest.js')
const auth = require('../app/http/middlewares/auth.js')
const admin = require('../app/http/middlewares/admin.js')
function inroutes(app) {
    app.get('/', homecontroller().index)
    app.get('/cart', cartcontroller().index)
    app.get('/login', guest, logincontroller().login)
    app.get('/register', guest, registercontroller().register)
    app.post('/update-cart', cartcontroller().update)
    app.post('/register', registercontroller().postregister)
    app.post('/login', logincontroller().postlogin)
    app.post('/logout', logincontroller().postlogout)
    app.post('/order', auth, ordercontroller().save)
    app.get('/customers/orders', auth, ordercontroller().orderpage)
    app.get('/admin/orders', admin, adminordercontroller().index)
    app.post('/admin/order/status', admin, statuscontroller().update)
    app.get('/customers/orders/:id', auth, ordercontroller().show)
}

module.exports = inroutes

