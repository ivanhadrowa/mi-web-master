document.querySelector(".bars__menu").addEventListener("click", animatedBars);

var line1__bars = document.querySelector(".line1__bars-menu");
var line2__bars = document.querySelector(".line2__bars-menu");
var line3__bars = document.querySelector(".line3__bars-menu");
var desplegable = document.querySelector(".menu__desplegable")

var mostrar = true;

function animatedBars(){
    line1__bars.classList.toggle("activeline1__bars-menu");
    line2__bars.classList.toggle("activeline2__bars-menu");
    line3__bars.classList.toggle("activeline3__bars-menu");
    desplegable.classList.toggle("activemenu__desplegable");
}

let productList = [];
let carrito = [];
let total = 0;
let order = {
    items:[]
}

function add(productId, price){

    const product = productList.find(p => p.id === productId);
    product.stock--;

    order.items.push(productList.find(p => p.id === productId))
    

    console.log(productId, price);
    carrito.push(productId);
    total = total + price;
    document.getElementById("checkout").innerHTML = `Carrito $${total}`
    displayProducts();
}

async function showOrder(){
    document.getElementById("product-cards").style.display = "none";
    document.getElementById("order").style.display = "block";
    document.getElementById("order-total").innerHTML = `Total: $${total}`;

    let productsHTML = `
    <tr>
        <th>Cantidad</th>
        <th>Detalle</th>
        <th>Subtotal</th>
    </tr>`
    ;
    order.items.forEach(p => {
      
        productsHTML +=
        ` <tr>
            <td>1</td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
          </tr>`
    });
    
    document.getElementById('order-table').innerHTML = productsHTML;
}


async function pay(){
    try{
        const preference = await (await fetch("/api/pay",{
            method: "post",
            body: JSON.stringify(carrito),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();

        var script = document.createElement("script");
  
        // The source domain must be completed according to the site for which you are integrating.
        // For example: for Argentina ".com.ar" or for Brazil ".com.br".
        script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
        script.type = "text/javascript";
        script.dataset.preferenceId = preference.preferenceId;
        script.setAttribute("data-button-label", "Pagar con Mercado Pago");
        document.getElementById("order-actions").innerHTML = "";
        document.querySelector("#order-actions").appendChild(script);
        


    }
    catch{
        window.alert("No hay Stock");
    }

    carrito = [];
    total = 0;
    let order = {
        items:[]
    };
    //await fetchProducts();
    document.getElementById("checkout").innerHTML = `Carrito $${total}`
}




function displayProducts(){
    document.getElementById("product-cards").style.display = "flex";
    document.getElementById("order").style.display = "none";

    let productsHTML = '';
    productList.forEach(p => {
        let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price}, Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'A??adido al Carrito',
            showConfirmButton: false,
            timer: 1500
          }))" >Agregar</button>`

        if (p.stock <= 0){
            buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id}, ${p.price})" >Sin Stock</button>`
        }

        productsHTML +=
        `<div  class="product-container">
            <h3>${p.name}</h3>
            <img src="${p.image}" alt="">
            <h1>${p.priceConSignos}</h1>
            ${buttonHTML}
        </div>`
    });
    document.getElementById('product-cards').innerHTML = productsHTML;
}

async function fetchProducts(){
    productList = await (await fetch("/api/products")).json();
    displayProducts();
}

window.onload = async() => {
    await fetchProducts();
}

