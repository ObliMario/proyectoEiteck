const bcrypt = require('bcrypt');
const User = require('../models/User');

async function crearAdminPorDefecto() {
  try {
    const existeAdmin = await User.findOne({ role: "admin" });
    if (!existeAdmin) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const adminUser = new User({
        name: "admin",
        email: "admin@admin.com",
        password: hashedPassword,
        role: "admin"
      });
      await adminUser.save();
      console.log('Usuario administrador por defecto creado exitosamente (admin@admin.com admin).');
    } else {
      console.log('El usuario administrador ya existe.');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  }
}

module.exports = crearAdminPorDefecto;