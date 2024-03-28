//Definir un esquema de usuario
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de sal

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);


// Registrar usuario con contrasena hasheada


userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

//Exportar

module.exports = User
