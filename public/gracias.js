document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    socket.emit('load data');

    socket.on('data loaded', ({ cart, products }) => {
        // Actualizar las cantidades de productos basándose en el carrito
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.cantidad -= item.cantidad;
            }
        });

        // Enviar los productos actualizados al servidor
        socket.emit('update products', products);
    });

    socket.on('update complete', () => {
        console.log('Los productos han sido actualizados correctamente.');
    });

    socket.on('error', (errorMessage) => {
        console.error('Error:', errorMessage);
    });
});
