document.addEventListener('DOMContentLoaded', function() {
    const socket = io();  // Conecta con el servidor Socket.io

    const buttons = document.querySelectorAll('.product-add');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.id;
            socket.emit('add to cart', productId);  // Envía un evento al servidor
            alert("Producto añadido al carro");
        });
    });

    socket.on('cart updated', function(cart) {
        console.log('Cart updated:', cart);  // Opcional: mostrar el carrito actualizado
    });
});
