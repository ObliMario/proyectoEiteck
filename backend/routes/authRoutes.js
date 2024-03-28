const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const bcrypt = require('bcrypt');

// Implemetar login y generar token JWT

// [Acceso: Todos]
router.post('/login', async (req, res) => {
  try {
    // Encuentra el usuario basado en el correo electrónico
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: 'Autenticación fallida. Usuario no encontrado.' });
    }

    // Comprueba si la contraseña es correcta
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Autenticación fallida. Contraseña incorrecta.' });
    }

    // Genera un token JWT
    const token = jwt.sign({ _id: user._id.toString(), role: user.role }, 'SecretKey', { expiresIn: '3h' });

    // Prepara los datos del usuario para enviar en la respuesta
    const userData = {
      name: user.name, // Asegúrate de que tu modelo de User tenga un campo 'name'
      email: user.email, // El correo electrónico ya lo tienes
      role: user.role, // Asegúrate también de que el modelo de User incluya un campo 'role'
      id : user._id
    };

    // Responde con el token JWT y los datos del usuario
    res.status(200).send({
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).send({ message: "Error al procesar la solicitud", error: error.message });
  }
});

router.get('/guest-access', (req, res) => {
  // Definir un payload con el rol de invitado
  const payload = {
    role: 'guest'
  };

  // Generar el token JWT con el rol de invitado
  const token = jwt.sign(payload, 'SecretKey', { expiresIn: '1h' });

  // Devolver el token al cliente
  res.json({ token });
});


module.exports = router;