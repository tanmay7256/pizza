import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

let add_to_cart_buttons = document.querySelectorAll('.addtocartbutton')
let add_to_cart_mainlogo = document.querySelector('#add_to_cart')

// console.log("jai")

function updatecart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        add_to_cart_mainlogo.innerText = res.data.totalqty
        new Noty({
            type: 'success',
            timeout: 100,
            progressBar: false,
            text: 'Item added to cart.'
        }).show();

    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 100,
            progressBar: false,
            text: 'Something went wrong',
        }).show();

    })
}
add_to_cart_buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updatecart(pizza);
    })
});
// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

// //admin
// initAdmin()

// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let datagot = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (datagot === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order);

let socket = io()
if (order) {
    socket.emit('join', `order_${order._id}`)
}

//
let adminAreaPath = window.location.pathname
if (adminAreaPath.includes('admin')) {
    // console.log(adminAreaPath)
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}
// jb admin change krega status tb agr customer n page khola hua toh use dikhega 

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})
