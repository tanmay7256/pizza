function logincontroller() {
    return {
        login(req, res) {
            res.render('auth/login')
        }
    }
}

module.exports = logincontroller