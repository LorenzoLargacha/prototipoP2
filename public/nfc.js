document.addEventListener('DOMContentLoaded', () => {
    if ('NDEFReader' in window) {
        const reader = new NDEFReader();
        const socket = io();  // Asegúrate de incluir la biblioteca de Socket.IO

        async function startNFCScan() {
            try {
                await reader.scan();
                console.log("Escaneo NFC activo.");

                reader.onreading = (event) => {
                    // Aquí podrías obtener información de la etiqueta NFC, por ejemplo:
                    const transactionData = { id: new Date().getTime(), status: 'pendiente' };

                    // Redirige a la página de espera
                    window.location.href = 'espera.html';

                    // Envía la información de la transacción al servidor
                    socket.emit('nfc_scanned', transactionData);
                };
            } catch (error) {
                console.error(`Error al escanear NFC: ${error}. Intentando de nuevo...`);
                setTimeout(startNFCScan, 1000);  // Espera 1 segundo antes de reintentar
            }
        }

        startNFCScan(); // Inicia el escaneo al cargar la página
    } else {
        console.log("NFC no es soportado en este dispositivo.");
        alert("NFC no es soportado en este dispositivo.");
    }
});
