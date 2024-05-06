document.addEventListener('DOMContentLoaded', function() {
    const socket = io();  // Conecta con el servidor Socket.io

    const buton = document.querySelector('.add-to-cart');
    buton.addEventListener('click', function() {
        const productId = this.id;
        socket.emit('add to cart', productId);  // Envía un evento al servidor
        alert("Producto añadido al carro");
    });

    socket.on('cart updated', function(cart) {
        console.log('Cart updated:', cart);  // Opcional: mostrar el carrito actualizado
    });

    const buton_favs = document.querySelector('.add-to-favorites');
    buton_favs.addEventListener('click', function() {
        const productId = this.id;
        socket.emit('add to favorites', productId);  // Envía un evento al servidor
        alert("Producto añadido a favoritos");
    });

    // Attach event handlers to remove item when swipping
    let pressTimer = null;
    const img = document.querySelector('.product-image');
    img.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        if (navigator.vibrate) {    // Verificar si el navegador admite el API de vibración
          navigator.vibrate(200);  // Vibrar con un toque
        } else {
          console.log("El navegador no admite el API de vibración.");
        }
        const productId = img.id;
        socket.emit('add to favorites', productId);  // Envía un evento al servidor
        alert("Producto añadido a favoritos");
      }, 2000); // 2000 ms = 2 segundos
    });
    img.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    });

    socket.on('favorites updated', function(favorites) {
        console.log('Favorites updated:', favorites);  // Opcional: mostrar el carrito actualizado
    });
});