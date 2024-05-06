document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  let productsData = [];

  // Function to fetch products data and render products
  function loadProducts() {
    fetch("productos/productos.json")
      .then((response) => response.json())
      .then((products) => {
        productsData = products; // Store the fetched products in a variable
        renderProducts();
       
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

    return productDiv;
  }

  function updateProductQuantity(productId, change) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
      product.cantidad += change;
      if (product.cantidad < 0) product.cantidad = 0;
      renderProducts();
      
      socket.emit("update stock", productsData);
    }
  }


  

  // Load products when DOM is fully loaded
  loadProducts();
  socket.on('cart updated', function(updatedCart) {
    productsData = updatedCart;
    renderProducts();

    
  });



});
