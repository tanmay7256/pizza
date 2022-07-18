import axios from 'axios'
import Noty from 'noty'
let add_to_cart_buttons = document.querySelectorAll('.addtocartbutton')
let add_to_cart_mainlogo = document.querySelector('#add_to_cart')



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