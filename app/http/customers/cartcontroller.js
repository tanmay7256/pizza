const { update } = require("../../models/menu")

const { json } = require("express")

function cartcontroller() {
    return {
        index(req, res) {
            return res.render('customers/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }
            // for the first time creating cart and adding basic object structure
            // console.log(req.body)
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalqty: 0,
                    totalprice: 0
                }
            }
            let cart = req.session.cart;
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1,
                },
                    cart.totalqty = cart.totalqty + 1,
                    cart.totalprice = cart.totalprice + req.body.price
            }
            else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalqty = cart.totalqty + 1
                cart.totalprice = cart.totalprice + req.body.price
            }
            return res.json({ totalqty: req.session.cart.totalqty })
        }
    }
}

module.exports = cartcontroller