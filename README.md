# Sistema de Gestión de Usuarios

Este proyecto implementa un completo sistema de gestión de usuarios que ofrece funcionalidades de autenticación, registro, búsqueda, actualización y eliminación de usuarios. Construido con tecnologías modernas para el desarrollo web, este sistema está diseñado para proporcionar una experiencia de usuario fluida mientras asegura la gestión eficiente de los datos de los usuarios.

## Características

- **Autenticación de Usuarios:** Inicio de sesión seguro y generación de tokens JWT para sesiones de usuario.
- **Ingreso como invitado:** Permite obtener un token de invitado sin necesidad de un registro o inicio de sesión.
- **Registro de Usuarios:** Permite a nuevos usuarios ser registrados solamente por un administrador del sistema.
- **Búsqueda de Usuarios:** Facilita la búsqueda de usuarios específicos por correo electrónico.
- **Actualización de Información de Usuarios:** Los usuarios pueden actualizar su propia información, mientras que los administradores pueden modificar cualquier detalle de los usuarios, incluidos los roles.
- **Eliminación de Usuarios:** Funcionalidad que permite a los administradores eliminar usuarios del sistema.
- **Listado de Usuarios:** Muestra una lista de todos los usuarios registrados en el sistema, accesible por usuarios con sesión iniciada o invitados con acceso controlado.

## Tecnologías Utilizadas

- **Backend:** Node.js con Express para el manejo de solicitudes API y MongoDB como sistema de base de datos.
- **Frontend:** HTML, CSS y JavaScript para la interfaz de usuario, facilitando la interacción con el backend a través de la API.