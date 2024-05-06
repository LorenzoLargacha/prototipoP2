// pagos.js
document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    socket.on('connect', () => {
        socket.emit('request_transactions');
    });

    socket.on('transactions', (transactions) => {
        const listaPagos = document.getElementById('lista-pagos');
        listaPagos.innerHTML = ''; // Limpiar lista existente
        transactions.forEach(t => {
            const div = document.createElement('div');
            div.innerHTML = `Transacción ${t.id}: <button onclick="accept(${t.id})">Aceptar</button> <button onclick="reject(${t.id})">Rechazar</button>`;
            listaPagos.appendChild(div);
        });
    });


  socket.on('transactions_updated', () => {
      window.location.reload();
  });
  
    window.accept = (transactionId) => {
        socket.emit('accept_transaction', transactionId);
    };

    window.reject = (transactionId) => {
        socket.emit('reject_transaction', transactionId);
    };
});
