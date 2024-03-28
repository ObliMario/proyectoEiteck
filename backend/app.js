const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { verificarToken } = require('./middleware/authMiddleware');
const crearAdminPorDefecto = require('./utils/initialSetup');

//Cors
const cors = require('cors');
app.use(cors()); // Aplica CORS a todas las rutas

app.get('/', (req, res) => {
  res.send('Hola Mundo con Express y Node.js!');
});

app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});

//DB Connection
const mongoose = require('mongoose');
const mongoDB_URI = 'mongodb://localhost/ProyectoEiteck';

mongoose.connect(mongoDB_URI, {})
  .then(() => {
    console.log('Conectado a MongoDB');
    crearAdminPorDefecto(); // Esto creará el usuario administrador por defecto si no existe
  })
  .catch(err => console.error('Error al conectar a MongoDB', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', function () {
  console.log('Conectado exitosamente a MongoDB');
});

app.use(express.json()); // Middleware para parsear JSON
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', verificarToken, userRoutes); // Protege todas las rutas de usuarios