const User = require("../../../models/user")
const bcrypt = require('bcrypt')
function registercontroller() {
    return {
        register(req, res) {
            res.render('auth/register')
        },
        async postregister(req, res) {
            let { name, email, password } = req.body

            if (!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already exists.')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            const hashedpassword = await bcrypt.hash(password, 10)
            // Create a user 
            const user = new User({
                name,
                email,
                password: hashedpassword
            })

            user.save().then((user) => {
                // Login
                return res.redirect('/login')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
        }
    }
}

module.exports = registercontroller