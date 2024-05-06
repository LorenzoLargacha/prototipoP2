# Sistemas Interactivos y Ubicuos - P2
## Implementación del prototipo

**Grupo 8**
* Rocío Gispert Fernández – 100432022
* Miguel Abella Miravet – 100451060
* Lorenzo Largacha Sanz – 100432129


## Funcionalidades Implementadas:

- Añadir al carrito escaneando: Para ello deberá tener el uso de la cámara permitido. Coloque el codigo qr (carpeta public/media/codigos_qr) dentro del area de enfoque de la cámara. Una vez la cámara del movil detecte el codigo,la aplicacion le llevará automaticamente a la ficha del producto asociado con ese qr.  
- Eliminar del carrito deslizando: En la pagina del carrito, puede eliminar los productos deslizando a la derecha.  
- Ordenar productos del carrito:En la página del carrito también puede ordenar los productos segun la cantidad en orden ascendente agitando el movil.Cuando agitas el movil,además de reorganizar la lista de productos, se produce una corta vibración.
  
- Marcar como favorito: En la página de información de cada producto deberá manteniendo pulsado sobre la imagen del producto para añadirlo a la lista de favoritos. Alternativamente podrá pulsar el botón "Añadir a favoritos".  
- Eliminar de favoritos deslizando: En la página de favoritos,puede eliminar los productos deslizando a la derecha.  
  
- Cobro del carro de compras: para evitar tener que escanear los productos en caja, el cliente podrá pulsar el botón "Pagar" desde su carro y acercar su dispositivo a un lector NFC en la caja para avisar al dependiente de su intención de pagar (probar con tarjeta de abono transportes NFC o similar). Tras leer mediante NFC se mostrará la ventana "Esperando confirmación de pago", y cuando el dependiente confirme el pago, se mostrará la confirmación y permitirá volver al inicio.  
  
- Interfaz dependiente: Hemos creado una interfaz que simula la aplicacion a la que podría acceder un dependiente. Para ingresar en ella deberá añadir al url /dependiente. El dependiente tiene dos funcionalidades:  
    - Acceder a las existencias: Puede ver el recuento de existencias y modificarlas. (FUNCIONALIDAD EXTRA)
    - Aceptar o rechazar pagos del cliente: Una vez un cliente realiza un pago,le salta una notificación         al dependiente en la página de pagos donde puede aceptar o rechazar el pago que se acaba de realizar.  
  
- Mapa guiado en tienda: Finalmente no hemos podido implementar un mapa funcional por la dificultad de encontrar un soporte gratuito con mapas interiores de una tienda, en su lugar hemos decidido mostrar un plano con el camino al producto desde la entrada de la tienda.  
  
- Seleccionar tienda más cercana según ubicación (mapa):En la página de inicio tiene la opción de ver las  tiendas en el mapa.Todas aparecen en color naraja,excepto la que se encuentre más cercana a su ubicacion que aparece en azul, y que es la que se seleccion. (FUNCIONALIDAD EXTRA)  
  