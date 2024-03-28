const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verificarAdmin } = require('../middleware/authMiddleware'); // Correcta importación con desestructuración

const router = express.Router();

// Ruta protegida
router.get('/rutaProtegidaAdmin', verificarAdmin, (req, res) => {
  res.json({ mensaje: "Acceso a la ruta protegida concedido", usuario: req.user });
});


// Ruta de registro [Acceso: admin]
router.post('/', verificarAdmin, async (req, res) => {

  // Validar el rol
  const rolesPermitidos = ['admin', 'user', 'guest'];
  if (!rolesPermitidos.includes(req.body.role)) {
    return res.status(400).send({ message: "Rol inválido. Los roles permitidos son admin, user, guest." });
  }

  try {
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send('El correo electrónico ya está en uso.');
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Crea un nuevo usuario
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || 'invitado', // Opcional: establece un rol predeterminado
    });

    // Guarda el usuario en la base de datos
    const newUser = await user.save();

    // Envía una respuesta exitosa
    res.status(201).json({ message: "Usuario registrado exitosamente", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
  }
});

//Eliminar usuarios [Acceso: admin]
router.delete('/:id', verificarAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const usuarioEliminado = await User.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).send({ mensaje: "Usuario no encontrado." });
    }

    res.send({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ mensaje: "Error al eliminar el usuario", error: error.message });
  }
});


//Actualiza la informacion de los usuarios [Acceso: admin, same user ]
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, role } = req.body;
  // Cambia req.user.userId por req.user._id para que coincida con el payload del token
  if (!req.user) {
    return res.status(500).send({ message: "No se ha podido verificar el usuario." });
  }
  const { userId, userRole } = req.user;

  if (userId !== id && userRole !== 'admin') {
    return res.status(403).send({ message: 'No autorizado para realizar esta acción.' });
  }

  // Validar el rol
  const rolesPermitidos = ['admin', 'user', 'guest'];
  if (!rolesPermitidos.includes(req.body.role)) {
    return res.status(400).send({ message: "Rol inválido. Los roles permitidos son admin, user, guest." });
  }

  try {
    // Encuentra el usuario por ID y actualiza
    if (userRole == 'admin') {
      const usuario = await User.findByIdAndUpdate(id, {
        name: nombre,
        email: correo,
        role: role
      }, { new: true }); //para devolver el documento modificado
      if (!usuario) return res.status(404).send({ mensaje: "Usuario no encontrado." });
      res.status(200).send({ mensaje: "Usuario actualizado correctamente" });
    }
    else {
      const usuario = await User.findByIdAndUpdate(id, {
        name: nombre,
        email: correo,
      }, { new: true }); //para devolver el documento modificado
      if (!usuario) return res.status(404).send({ mensaje: "Usuario no encontrado." });
      res.status(200).send({ mensaje: "Usuario actualizado correctamente. El rol solamente puede ser alterado por un administrador. Su rol es: "+ userRole });

    }

  } catch (error) {
    res.status(500).send({ mensaje: "Error al actualizar el usuario", error: error.message });
  }
});

// Ruta para buscar usuarios por correo electrónico [Acceso: Admin]
router.get('/buscar', verificarAdmin,  async (req, res) => {
  const { correo } = req.query; // Obtiene el correo de los parámetros de consulta

  try {
    // Realiza una búsqueda exacta por correo electrónico, excluyendo la contraseña
    const usuario = await User.findOne({ email: correo }).select("-password");

    if (!usuario) {
      return res.status(404).send({ mensaje: "No se encontró un usuario con ese correo electrónico." });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).send({ mensaje: "Error al buscar el usuario por correo electrónico", error: error.message });
  }
});

//Lista la informacion de los usuarios [Acceso: Usuario con login o invitados]
router.get('/', async (req, res) => {
  try {
    const usuarios = await User.find({}); // Encuentra todos los usuarios
    // Filtra las contraseñas
    const usuariosSinPassword = usuarios.map(user => {
      const { password, ...userSinPassword } = user.toObject();
      return userSinPassword;
    });
    res.json(usuariosSinPassword);
  } catch (error) {
    res.status(500).send({ message: 'Error al recuperar los usuarios', error: error.message });
  }
});


module.exports = router;