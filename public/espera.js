document.addEventListener('DOMContentLoaded', function() {
    const socket = io(); // Conectarse al servidor de Socket.IO

    socket.on('connect', () => {
        console.log('Conectado al servidor de sockets.');
    });

    socket.on('update_transaction', (transaction) => {
        if (transaction.status === 'aprobado') {
            window.location.href = 'gracias.html';
        } else if (transaction.status === 'rechazado') {
            window.location.href = 'error.html';
        }
    });
});