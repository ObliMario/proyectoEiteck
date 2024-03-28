function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login fallido: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Almacena el token y los datos del usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);

        // Actualiza la UI para reflejar el estado de login exitoso
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('userInfo').textContent = `Bienvenido, ${data.user.name}`;

    })
    .catch(error => {
        console.error('Error en el login:', error);
        alert(error.message);
    });
}

function showRegisterForm() {
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('searchUserForm').style.display = 'none';
    document.getElementById('updateUserForm').style.display = 'none';
    document.getElementById('userList').style.display = 'none';
    document.getElementById('deleteUserForm').style.display = 'none';
}
function showSearch() {
    document.getElementById('searchUserForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('updateUserForm').style.display = 'none';
    document.getElementById('userList').style.display = 'none';
    document.getElementById('deleteUserForm').style.display = 'none';
}
function showActualizar() {
    cargarDatosUsuario()
    document.getElementById('updateUserForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('searchUserForm').style.display = 'none';
    document.getElementById('userList').style.display = 'none';
    document.getElementById('deleteUserForm').style.display = 'none';
}
function showEliminar() {
    document.getElementById('deleteUserForm').style.display = 'block';
    document.getElementById('updateUserForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('searchUserForm').style.display = 'none';
    document.getElementById('userList').style.display = 'none';
}



function showUsers() {
    const usersElement = document.getElementById('users'); 
    if (!usersElement) {
        console.error('El elemento para listar los usuarios no se encuentra en el HTML.');
        return;
    }

    fetch('http://localhost:3000/api/usuarios/', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de la API no fue exitosa: ' + response.statusText);
            }
            document.getElementById('userList').style.display = 'block';
            document.getElementById('updateUserForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('searchUserForm').style.display = 'none';
            document.getElementById('deleteUserForm').style.display = 'none';

            return response.json();
        })
        .then(users => {
            if (!Array.isArray(users)) {
                console.error('Se esperaba un array de usuarios, pero se recibió:', users);
                return;
            }
            // Limpia el contenido anterior
            usersElement.innerHTML = '';

            // Procesa cada usuario y lo añade al elemento de lista
            users.forEach(user => {
                if (user.name && user.email) { 
                    const li = document.createElement('li');
                    li.textContent = `${user.name} (${user.email})`;
                    usersElement.appendChild(li);
                } else {
                    console.error('Usuario no tiene las propiedades esperadas:', user);
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener los usuarios:', error);
        });
}
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
        body: JSON.stringify({ name, email, password, role }), 
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registro fallido: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Registro:', data);
            alert('Registro exitoso: ' + JSON.stringify(data));
        })
        .catch((error) => {
            console.error('Error en el registro:', error);
            alert(error.message);
        });
}

function buscarUsuarioPorCorreo() {
    const email = document.getElementById('searchEmail').value; 

    fetch(`http://localhost:3000/api/usuarios/buscar?correo=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'), // Usa el token almacenado
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Búsqueda fallida: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Usuario encontrado:', data);
            alert('Usuario encontrado: ' + JSON.stringify(data));
        })
        .catch((error) => {
            console.error('Error en la búsqueda:', error);
            alert(error.message);
        });
}

function actualizarUsuario() {
    
    const userId = document.getElementById('updateUserId').value;
    const nombre = document.getElementById('updateUserName').value;
    const correo = document.getElementById('updateUserEmail').value;
    const role = document.getElementById('updateUserRole').value;

    fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify({ nombre, correo, role }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Actualización fallida: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Actualización exitosa:', data);
            alert('Usuario actualizado exitosamente: ' + JSON.stringify(data));
        })
        .catch((error) => {
            console.error('Error en la actualización:', error);
            alert(error.message);
        });
}

function loginComoInvitado() {
    fetch('http://localhost:3000/api/auth/guest-access', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener acceso como invitado: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Almacena el token de invitado en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('modo', 'invitado');
            // Actualiza la UI para reflejar el estado de invitado
            document.getElementById('loginForm').style.display = 'none'; // Oculta el formulario de login
            document.getElementById('appContent').style.display = 'block'; // Muestra el contenido de la app
            document.getElementById('userInfo').style.display = 'block'; // Muestra la sección de información del usuario
            document.getElementById('userInfo').textContent = 'Bienvenido, Invitado'; // Muestra un mensaje de bienvenida para el invitado
        })
        .catch(error => {
            console.error('Error al obtener acceso como invitado:', error);
            alert(error.message);
        });
}
function eliminarUsuario() {
    const userId = document.getElementById('deleteUserId').value;

    fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Eliminación fallida: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Eliminación exitosa:', data);
            alert('Usuario eliminado correctamente: ' + JSON.stringify(data));
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
            alert(error.message);
        });
}
function cargarDatosUsuario() {
    console.log('cargar datos')
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    document.getElementById('updateUserId').value = userId;
    document.getElementById('updateUserName').value = userName;
    document.getElementById('updateUserEmail').value = userEmail;
    document.getElementById('updateUserRole').value = localStorage.getItem('userRole');
}
