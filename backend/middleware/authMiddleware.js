const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'Token de autenticación requerido.' });

  jwt.verify(token, 'SecretKey', (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Autenticación fallida. Token inválido o expirado.' });

    req.user = { userId: decoded._id, userRole: decoded.role };
    next();
  });
};


// Middleware para verificar el token y el rol de administrador
const verificarAdmin = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send({ message: 'Token de autenticación requerido.' });

  jwt.verify(token, process.env.JWT_SECRET || 'SecretKey', (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Autenticación fallida. Token inválido o expirado.' });

    // Token es válido, verificar el rol de usuario
    if (decoded.role === 'admin') {
      req.user = decoded; // Pasar datos de usuario al siguiente middleware
      next();
    } else {
      res.status(403).send({ message: 'Acceso restringido. Se requiere rol de administrador.' });
    }
  });
};

module.exports = { verificarToken, verificarAdmin };

