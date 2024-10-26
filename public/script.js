// Mostrar productos
document.getElementById('ver-productos').addEventListener('click', () => {
    fetch('/productos')
        .then(response => response.json())
        .then(productos => {
            const contenido = document.getElementById('contenido');
            contenido.innerHTML = '<h2>Productos</h2>';
            productos.forEach(producto => {
                contenido.innerHTML += `
                    <div class="producto">
                        <h3>${producto.nombre}</h3>
                        <p>Precio: $${producto.precio}</p>
                        <button onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));
});

// Mostrar carrito con productos actualizados y opción de eliminar
document.getElementById('ver-carrito').addEventListener('click', () => {
    const token = localStorage.getItem('token');
    fetch('/carrito', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(carrito => {
        const contenido = document.getElementById('contenido');
        contenido.innerHTML = '<h2>Carrito de Compras</h2>';
        if (carrito.length === 0) {
            contenido.innerHTML += '<p>El carrito está vacío</p>';
        } else {
            carrito.forEach(item => {
                contenido.innerHTML += `
                    <div class="carrito-item">
                        <p>Producto: ${item.nombre} - Precio: $${item.precio} - Cantidad: ${item.cantidad}</p>
                        <button onclick="eliminarDelCarrito(${item.productoId})">Eliminar</button>
                    </div>
                `;
            });
        }
    })
    .catch(error => console.error('Error al cargar carrito:', error));
});

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
    const token = localStorage.getItem('token');
    fetch('/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productoId: productoId, cantidad: 1 })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        document.getElementById('ver-carrito').click(); // Actualiza el carrito después de agregar
    })
    .catch(error => console.error('Error al agregar al carrito:', error));
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
    const token = localStorage.getItem('token');
    console.log("Intentando eliminar producto con ID:", productoId); // Log para verificar el ID antes de la solicitud

    fetch(`/carrito/${productoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        document.getElementById('ver-carrito').click(); // Actualizar el carrito después de eliminar
    })
    .catch(error => console.error('Error al eliminar del carrito:', error));
}

// Mostrar/ocultar formulario de login
document.getElementById('login-toggle').addEventListener('click', () => {
    const loginSection = document.getElementById('login-section');
    loginSection.style.display = loginSection.style.display === 'none' ? 'block' : 'none';
});

// Manejo del formulario de login
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
            document.getElementById('login-section').style.display = 'none';
        } else {
            alert(data.mensaje || 'Error al iniciar sesión');
        }
    })
    .catch(error => console.error('Error en login:', error));
});
