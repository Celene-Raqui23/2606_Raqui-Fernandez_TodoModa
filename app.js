const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const productos = [
  { id: 1, nombre: 'Camiseta básica', precio: 20 },
  { id: 2, nombre: 'Jeans', precio: 40 },
  { id: 3, nombre: 'Chaqueta de cuero', precio: 100 },
  { id: 4, nombre: 'Sudadera', precio: 50 },
  { id: 5, nombre: 'Zapatos', precio: 80 },
  { id: 6, nombre: 'Sombrero', precio: 15 }
];

let carrito = [];

// Rutas
app.get('/productos', (req, res) => {
  res.json(productos);
});

app.post('/carrito', (req, res) => {
  const { productoId, cantidad } = req.body;
  carrito.push({ productoId, cantidad });
  res.json({ mensaje: 'Producto añadido al carrito' });
});

app.get('/carrito', (req, res) => {
  const carritoCompleto = carrito.map(item => {
    const producto = productos.find(p => p.id === item.productoId);
    return {
      nombre: producto ? producto.nombre : 'Producto no encontrado',
      precio: producto ? producto.precio : 0,
      cantidad: item.cantidad,
      productoId: item.productoId
    };
  });
  res.json(carritoCompleto);
});

app.delete('/carrito/:productoId', (req, res) => {
  const productoId = parseInt(req.params.productoId, 10); // Convertir productoId a número
  console.log("Recibiendo solicitud de eliminación para el producto con ID:", productoId);

  const carritoAnterior = [...carrito];
  carrito = carrito.filter(item => item.productoId !== productoId);

  if (carritoAnterior.length === carrito.length) {
    res.status(404).json({ mensaje: 'Producto no encontrado en el carrito' });
  } else {
    res.json({ mensaje: 'Producto eliminado del carrito' });
  }
});

// Autenticación con JWT
const usuarios = [{ username: 'cliente', password: '12345' }];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
  }
});

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token requerido');
  }

  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      return res.status(500).send('Token inválido');
    }
    req.user = decoded;
    next();
  });
};

// Ruta protegida (solo accesible con token)
app.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: 'Bienvenido al perfil', user: req.user });
});

// Puerto de la aplicación
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
