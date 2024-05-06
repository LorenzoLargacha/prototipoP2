const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const fs = require("fs");



// Sirviendo archivos estáticos
app.use(express.static(path.join(__dirname, "public")));


let transactions = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/dependiente", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dependiente.html"));
});

app.get("/dependiente", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dependiente.html"));
});

io.on("connection", (socket) => {
  socket.on("add to cart", (productId) => {
    const filePath = path.join(__dirname, 'public/carrito.json');
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      let cart = JSON.parse(data);
      const product = cart.find(p => p.id === parseInt(productId));
      if (product) {
        product.cantidad++;
        fs.writeFile(filePath, JSON.stringify(cart, null, 2), (err) => {
          if (err) throw err;
          io.emit('cart updated', cart);  // Notificar a todos los clientes
        });
      }
    });
  });

  socket.on("add to favorites", (productId) => {
    const filePath = path.join(__dirname, 'public/favoritos.json');
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      let favoritos = JSON.parse(data);
      const product = favoritos.find(p => p.id === parseInt(productId));
      if (product) {
        product.cantidad++;
        fs.writeFile(filePath, JSON.stringify(favoritos, null, 2), (err) => {
          if (err) throw err;
          io.emit('favorites updated', favoritos);  // Notificar a todos los clientes
        });
      }
    });
  });

  socket.on('nfc_scanned', (transactionData) => {
      // Agrega la nueva transacción a la lista
      transactions.push(transactionData);
      console.log('Nueva transacción añadida:', transactionData);

      io.emit('transactions_updated', transactions);
  });

  socket.on("update cart", (cart) => {
    fs.writeFile("public/carrito.json", JSON.stringify(cart), (err) => {
      if (err) {
        console.error('Error writing file', err);
      } else {
        console.log('Cart successfully updated');
        io.emit('cart updated', cart); // Notificar a todos los clientes
      }
    });
  });

  socket.on("update stock", (cart) => {
    fs.writeFile("public/productos/productos.json", JSON.stringify(cart), (err) => {
      if (err) {
        console.error('Error writing file', err);
      } else {
        console.log('Stock successfully updated');
        io.emit('cart updated', cart); // Notificar a todos los clientes
      }
    });
  });

  socket.on('load data', () => {
      const cartData = fs.readFileSync(path.join(__dirname, 'public', 'carrito.json'), 'utf8');
      const productData = fs.readFileSync(path.join(__dirname, 'public', 'productos/productos.json'), 'utf8');
      socket.emit('data loaded', { cart: JSON.parse(cartData), products: JSON.parse(productData) });
  });

  socket.on('update products', (products) => {
    fs.writeFile(path.join(__dirname, 'public', 'productos/productos.json'), JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error('Error writing file', err);
        socket.emit('error', 'Failed to update products');
      } else {
        socket.emit('update complete');
      }
    });
  });

  socket.on('removeFavorite', (product) => {
    const productId = product.id;
    const filePath = path.join(__dirname, 'public/favoritos.json');
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;

      let favoritos = JSON.parse(data);

      const product = favoritos.find(p => p.id === parseInt(productId));
      if (product) {
        product.cantidad = 0;
        fs.writeFile(filePath, JSON.stringify(favoritos, null, 2), (err) => {
          if (err) {
            console.error('Error writing file', err);
            socket.emit('error', 'Failed to update favorites');
          } else {
            console.log('Product removed from favorites');
            socket.emit('favorites updated', favoritos);
          } 
        });
      }
    });
  });

  socket.on('request_transactions', () => {
      socket.emit('transactions', transactions);
  });

  // Aceptar una transacción
  socket.on('accept_transaction', (transactionId) => {
      const index = transactions.findIndex(t => t.id === transactionId);
      if (index !== -1) {
          transactions.splice(index, 1); // Elimina la transacción de la lista
          io.emit('update_transaction', { id: transactionId, status: 'aprobado' });
      }
    io.emit('transactions_updated');
  });


  // Rechazar una transacción
  socket.on('reject_transaction', (transactionId) => {
      const index = transactions.findIndex(t => t.id === transactionId);
      if (index !== -1) {
          transactions.splice(index, 1); // Elimina la transacción de la lista
          io.emit('update_transaction', { id: transactionId, status: 'rechazado' });
      }
    io.emit('transactions_updated');
  });
  
  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});






const port = 3000;
server.listen(port, "0.0.0.0", () =>
  console.log(`Servidor escuchando en http://localhost:${port}`),
);
