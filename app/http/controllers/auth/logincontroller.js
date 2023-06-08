const session = require('express-session')
const User = require('../../../models/user')
const passport = require("passport")
function logincontroller() {
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postlogin(req, res, next) {
            const { email, password } = req.body
            // Validate request 
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            // y wala wha se aara h jo y local k baad aara h 
            let item = null;
            if (req.session.cart)
                item = req.session.cart;
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    if (item != null)
                        req.session.cart = item// as when user login then its preselected items should be saved
                    if (user.role == "customer")
                        return res.redirect('/customers/orders')
                    else
                        return res.redirect('/admin/orders')
                })
            })(req, res, next)
        },
        postlogout(req, res, next) {
            req.logout(function (err) {
                if (err) { return next(err); }
                res.redirect('/login');
            });
        }
    }
}

module.exports = logincontroller