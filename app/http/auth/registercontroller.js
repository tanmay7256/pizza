function registercontroller() {
    return {
        register(req, res) {
            res.render('auth/register')
        }
    }
}

module.exports = registercontroller