document.addEventListener('DOMContentLoaded', function () {
    const video = document.querySelector("#videoElement");
    const canvasElement = document.createElement('canvas');
    const canvas = canvasElement.getContext('2d');

    function scanQRCode() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                console.log("Código QR encontrado: ", code.data);
                let partes = code.data.split("//");
                let producto = partes[1];  // String con lo que viene después de '//'
                window.location.href = "productos/" + producto;
            } else {
                // Si no se encuentra ningún código, sigue intentándolo
                requestAnimationFrame(scanQRCode);
            }
        } else {
            requestAnimationFrame(scanQRCode);
        }
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
                requestAnimationFrame(scanQRCode);
            })
            .catch(function (error) {
                console.error("Algo salió mal al tratar de obtener el acceso a la cámara: ", error);
            });
    } else {
        alert('Tu navegador no soporta media devices.');
    }
});
