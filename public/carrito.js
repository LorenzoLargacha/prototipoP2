document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  let productsData = [];

  // Function to fetch products data and render products
  function loadProducts() {
    fetch("carrito.json")
      .then((response) => response.json())
      .then((products) => {
        productsData = products; // Store the fetched products in a variable
        renderProducts();
        updatePriceDetails();
      })
      .catch((error) => console.error("Error loading products:", error));
  }

  // Function to render all products
  function renderProducts() {
    const productsContainer = document.querySelector(".products");
    productsContainer.innerHTML = ""; // Clear the container before re-rendering
    productsData.forEach((product) => {
      if (product.cantidad > 0) {
        productsContainer.appendChild(createProductElement(product));
      }
    });
  }

  // Function to create a product element
  function createProductElement(product) {
    const productsContainer = document.querySelector(".products");

    // Create the product div
    const productDiv = document.createElement("div");
    productDiv.className = "product";

    // Add the image
    const img = document.createElement("img");
    img.src = `media/${product.image}`;
    img.alt = product.name;
    productDiv.appendChild(img);

    // Add product info
    const productInfo = document.createElement("div");
    productInfo.className = "product-info";
    const productName = document.createElement("p");
    productName.textContent = product.name;
    productInfo.appendChild(productName);

    // Add price and discounted price if necessary
    if (product.precioantes && product.precioantes > product.price) {
      const discountedPrice = document.createElement("span");
      discountedPrice.className = "discounted-price";
      discountedPrice.textContent = `${product.precioantes}€`;
      productInfo.appendChild(discountedPrice);
    }
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `${product.price}€`;
    productInfo.appendChild(price);

    productDiv.appendChild(productInfo);

    // Add quantity controls
    const quantityDiv = document.createElement("div");
    quantityDiv.className = "quantity";
    const decrementButton = document.createElement("button");
    decrementButton.className = "decrement";
    decrementButton.textContent = "-";
    const quantitySpan = document.createElement("span");
    quantitySpan.textContent = product.cantidad;
    const incrementButton = document.createElement("button");
    incrementButton.className = "increment";
    incrementButton.textContent = "+";

    // Append buttons and quantity to the quantity div
    quantityDiv.appendChild(decrementButton);
    quantityDiv.appendChild(quantitySpan);
    quantityDiv.appendChild(incrementButton);

    // Append quantityDiv to the productDiv
    productDiv.appendChild(quantityDiv);

    // Append productDiv to the productsContainer
    productsContainer.appendChild(productDiv);

    // Attach event handlers to the buttons
    decrementButton.addEventListener("click", function () {
      if (product.cantidad > 0) {        
        updateProductQuantity(product.id, -1);
      } 
    });

    incrementButton.addEventListener("click", function () {
      updateProductQuantity(product.id, 1);
    });

    // Attach event handlers to remove item when swipping
    let startX = null;
    productDiv.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    productDiv.addEventListener('touchmove', (e) => {
      if (startX === null) return;
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      if (deltaX > 50) {
        updateProductQuantity(product.id, -product.cantidad);
        startX = null; // Reiniciar startX
      }
    });
    productDiv.addEventListener('touchend', () => {
      startX = null;
    });

    return productDiv;
  }

  function updateProductQuantity(productId, change) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
      product.cantidad += change;
      if (product.cantidad < 0) product.cantidad = 0;
      renderProducts();
      updatePriceDetails();
      socket.emit("update cart", productsData);
    }
  }

  
  // Update the price details
  function updatePriceDetails() {
    let subtotal = productsData.reduce(
      (total, product) => total + product.price * product.cantidad,
      0,
    );
    let iva = subtotal * 0.21;
    let total = subtotal * 0.79 + iva;

    document.querySelector(".summary .subtotal").textContent =
      `${(subtotal * 0.79).toFixed(2)}€`;
    document.querySelector(".summary .iva").textContent =
      `${(subtotal * 0.21).toFixed(2)}€`;
    document.querySelector(".summary .total").textContent =
      `${total.toFixed(2)}€`;
  }

  // Event listener for the date picker
  const dateSelect = document.querySelector("#date");
  dateSelect.addEventListener("change", function () {
    const dateLabel = document.querySelector(".date-selection label");
    dateLabel.textContent = `Fecha seleccionada: ${this.value}`;
  });

  // Event listener for changing the address
  const changeAddressButton = document.querySelector(".address button");
  changeAddressButton.addEventListener("click", function () {
    const newAddress = prompt("Introduce la nueva dirección de envío:");
    if (newAddress) {
      const addressP = document.querySelector(".address p:nth-of-type(2)");
      addressP.textContent = newAddress;
    }
  });

  // Load products when DOM is fully loaded
  loadProducts();
  socket.on('cart updated', function(updatedCart) {
    productsData = updatedCart;
    renderProducts();
    updatePriceDetails();
  });
    
  // Función para manejar el movimiento del dispositivo
  function handleDeviceMotion(event) {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 15; // Umbral de sensibilidad al movimiento, ajusta según sea necesario

    // Verifica si la aceleración supera el umbral en alguna dirección
    if (Math.abs(acceleration.x) > threshold ||
        Math.abs(acceleration.y) > threshold ||
        Math.abs(acceleration.z) > threshold) {
      // Ordena los productos según la cantidad disponible (productQuantity) de mayor a menor
      productsData.sort((a, b) => b.cantidad - a.cantidad);

      // Vuelve a renderizar los productos después de ordenarlos
      renderProducts();

      // Vibrar el dispositivo
      vibrateDevice();
    }
  }

  // Manejador de evento para detectar el movimiento del dispositivo
  window.addEventListener('devicemotion', handleDeviceMotion);

  // Función para hacer vibrar el dispositivo
  function vibrateDevice() {
    if (navigator.vibrate) {
      // Hacer que el dispositivo vibre durante 200 milisegundos
      navigator.vibrate(200);
    }
  }


  
});
