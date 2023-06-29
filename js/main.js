const mainCards = document.getElementById("menu-products");
const carritoContador = document.getElementById("contadorCarrito");
carritoContador.classList.add("carritoContador");
const pedido = document.getElementById("pedido"); //modal body carrito falta hacerlo
const divTotal = document.getElementById("comprar");
let btnFinalizar = document.getElementById(`btn-finalizar`);


let total = 0; //$
let cantidadTotal = 0;


const url = "./data/tienda.json";
let productos = [];

loadProducts();

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
renderizarCarrito();


async function loadProducts() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("No hay productos cargados");
    }
    const data = await response.json();
    productos = data;
    filtrarProds("t-shirt");
  } catch (error) {
    console.error("Hubo un error al traer los datos:", error);
  }
}


function createFilterButton(items) {
  const button = document.createElement("button");
  const img = document.createElement("img");
  img.src = `./imagenes/${items}.png`;
  img.className = "img-fluid menu-icons";
  button.classList.add("btn-Mainmenu", "col-1");
  button.append(img);
  button.onclick = () => {
    filtrarProds(items);
  };
  return button;
}

function renderFilterButtons() {
  const buttonsContainer = document.getElementById("filterButtons");
  buttonsContainer.innerHTML = "";
  const items = ["notebooks", "t-shirt", "phoneCase"];
  items.forEach((items) => {
    const button = createFilterButton(items);
    buttonsContainer.appendChild(button);
  });
}

function filtrarProds(items) {
  const mostrar = productos.filter((product) => product.category === items);
  renderizarProds(mostrar);
}

renderFilterButtons();

//Cards dinamicamente
function renderizarProds(arr) {
  mainCards.innerHTML = arr.map(
    (product) => `
      <div class="card m-2 border border-start-0 border-3 d-flex flex-column align-items-center cards-dinamic">
          <img src="${product.img}" alt="${product.name}" class="card-img-top img-fluid img-size">
          <div class="card-body ">
              <h5 class="card-title text-center fw-bold">${product.name}</h5>
              <p class="card-text">${product.description}</p> 
              <p class="p-modal">Precio:$${product.price}</p>                 
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <button onclick="agregarCarrito(${product.id})" type="button" class="btn btn-success w-100 rounded-pill" id="btnComprar-${product.id}">Agregar al carrito</button>
            <div class="input-group ms-2" style="width: 80px;">
              <input type="number" min="1" value="1" class="form-control form-control-sm" id="cantidad-${product.id}">
            </div>
          </div>
      </div>
    `
  );
}

function limpiarHtml() {
  mainCards.innerHTML = "";
}

// Funcionalidad del carrito

function agregarCarrito(id) {
  let producto = productos.find((product) => {
    return product.id == id; 
  });

  let found = carrito.find((elemento) => elemento.id == id); 

  if (found) {
    
    Toastify({
      text: "Ya agregaste ese producto a carrito",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", 
      position: "left", 
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      stopOnFocus: true, //
      onClick: function () {}, 
    }).showToast();
  } else {
    carrito.push({ ...producto, quantity: 1 });
    renderizarCarrito();
    Toastify({
      text: "Producto agregado al carrito",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "left",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      stopOnFocus: true,
      onClick: function () {},
    }).showToast();
  }
}


function actualizarContadorCarrito() {
  cantidadTotal = carrito.reduce((total, item) => total + item.quantity, 0);
  carritoContador.textContent = cantidadTotal;
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerCarritoDeLocalStorage() {
  const carritoJSON = localStorage.getItem("carrito");
  return carritoJSON ? JSON.parse(carritoJSON) : [];  
}


function renderizarCarrito() {
  pedido.innerHTML = "";

  carrito.forEach((item) => {
    const { name, price, quantity } = item;

    const itemPedido = document.createElement("div");
    itemPedido.classList.add("item-pedido");

    const nombreProducto = document.createElement("p");
    nombreProducto.textContent = `${name} (x${quantity})`;

    const precioProducto = document.createElement("p");
    precioProducto.textContent = `$${price}`;

    itemPedido.appendChild(nombreProducto);
    itemPedido.appendChild(precioProducto);

    pedido.appendChild(itemPedido);
  });


  total = carrito.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

 
  divTotal.innerHTML = `Total: $${total.toFixed(2)}`;

  btnFinalizar.disabled = carrito.length === 0;
}

function renderizarCarrito() {
  total = 0;
  cantidadTotal = 0;

  pedido.innerHTML = "";
  carrito.forEach((product) => {
    const subtotal = product.price * product.quantity;
    cantidadTotal += product.quantity;
    total += subtotal;
    pedido.innerHTML += `
            <div class="card m-3">
                <img src="${product.img}" alt="${product.name}" class="card-img-top img-fluid">
                <div class="card-body">
                    <h5 class="card-title text-center fw-bold">${product.name}</h5>
                    <p class="p-modal">Precio:$${product.price}</p>
                    <label class="form-label" for="${product.id}">Cant.</label>
                    <input class="form-control" id="qty-${product.id}" type="number" name="quantity" min="1" max="30" oninput="validity.valid||(value='');" value="${product.quantity}" onchange="sumQuantity(${product.id})">
                    <div class ="d-flex flex-row-reverse justify-content-around m-4">
                    <button onclick="borrarProd(${product.id})" type="button" class="btn btn-danger text-uppercase" id="borrar-${product.id}">Eliminar producto</button>
                    <p class="p-modal">Subtotal: $${subtotal}</p>
                    </div>
                </div>
            </div>
        `;
  });

  divTotal.innerHTML = `<p>Cantidad de productos: ${cantidadTotal}</p>
                        <p class= "m-2">Total:$ ${total}</p>
                        `;
  carritoContador.innerHTML = `
                                    ${cantidadTotal}
                                `;

  localStorage.setItem("pedido", JSON.stringify(carrito));
}

function sumQuantity(id) {
  const producto = carrito.find((product) => product.id == id);
  const cantidad = document.getElementById(`qty-${id}`);
  producto.quantity = Number(cantidad.value);
  renderizarCarrito();
}

function borrarProd(id) {
  carrito = carrito.filter((product) => {
    return product.id != id;
  });
  renderizarCarrito();
  Toastify({
    text: "Producto borrado con éxito",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #FF6363, #FF0063)",
    stopOnFocus: true,
    onClick: function () {},
  }).showToast();
}



function vaciarCarrito() {
  pedido.innerHTML = "";
  carrito = [];
  Toastify({
    text: "Carrito vaciado con éxito",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #FF6363, #FF0063)",
    stopOnFocus: true,
    onClick: function () {},
  }).showToast();
  total = 0;
  cantidadTotal = 0;
  divTotal.innerHTML = `<p>Total:$ ${total}</p>
                        <p>Cantidad de productos: ${cantidadTotal}</p>
                        `;
  carritoContador.innerHTML = `
                                    ${cantidadTotal}
                                `;
}

actualizarContadorCarrito();
renderizarCarrito();
