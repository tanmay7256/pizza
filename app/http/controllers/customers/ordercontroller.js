const Order = require('../../../models/order')
// import { Noty } from 'noty'
const moment = require('moment')
function ordercontroller() {
    return {
        save(req, res) {
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields are required')
                res.redirect("/cart");
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                // new Noty({
                //     type: 'success',
                //     timeout: 100,
                //     progressBar: false,
                //     text: 'Order placed successfully.'
                // }).show();
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
                    req.flash('success', 'Order placed succesfully');
                    delete req.session.cart
                    res.redirect("customers/orders");
                })

            }).catch(err => {
                console.log(err)
                res.redirect("/");
            })
        },
        async orderpage(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/orderstatus', { order }) // same as order:order
            }
            return res.redirect('/')
        }
    }
}
module.exports = ordercontroller