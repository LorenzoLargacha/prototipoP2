document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  let productsData = [];

  // Function to fetch products data and render products
  function loadProducts() {
    fetch("favoritos.json")
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
    
    // Attach event handlers to remove item when swipping
    let startX = null;
    let pressTimer = null;
    productDiv.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      pressTimer = setTimeout(() => {
        if (navigator.vibrate) {    // Verificar si el navegador admite el API de vibración
          navigator.vibrate(200);  // Vibrar con un toque
        } else {
          console.log("El navegador no admite el API de vibración.");
        }
        startX = null; // Reiniciar startX después de completar la acción
      }, 2000); // 2000 ms = 2 segundos
    });
    productDiv.addEventListener('touchmove', (e) => {
      if (startX === null) return;
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      if (deltaX > 50) {
        // Send event to remove favorite
        socket.emit('removeFavorite', product);
        if (navigator.vibrate) {    // Verificar si el navegador admite el API de vibración
          navigator.vibrate(50);  // Vibrar con un toque
        } else {
          console.log("El navegador no admite el API de vibración.");
        }
        clearTimeout(pressTimer); // Reiniciar temporizador si se inicia un desplazamiento
        startX = null; // Reiniciar startX
      }
    });
    productDiv.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
      startX = null;
    });

    return productDiv;
  }

  // Load products when DOM is fully loaded
  loadProducts();
  
  socket.on('favorites updated', function(updatedFavorites) {
    productsData = updatedFavorites;
    renderProducts();
  });


});
