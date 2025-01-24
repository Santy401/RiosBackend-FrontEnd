# **📝 Administrador de Tareas para Usuarios**

Este proyecto es una **aplicación de gestión de tareas** diseñada para administradores que necesitan asignar y controlar tareas de manera eficiente. Los usuarios solo podrán ver las tareas asignadas específicamente a ellos, mientras que los administradores tienen acceso completo a todas las tareas.

## **🚀 Características principales**

- **👨‍💻 Gestión de usuarios:** Los administradores pueden crear, editar y gestionar la información de los usuarios.
- **🔄 Asignación de tareas:** Los administradores pueden crear tareas con título, descripción, fecha de vencimiento y asignarlas a usuarios.
- **👁‍🗨 Visualización de tareas para usuarios:** Cada usuario puede ver solo las tareas asignadas específicamente a ellos.
- **🛠️ Estado de las tareas:** Las tareas tienen los estados `pendiente`, `en progreso` y `completada`, permitiendo hacer un seguimiento claro.
- **🔔 Notificaciones:** Los usuarios reciben notificaciones cuando se les asigna una tarea nueva o cuando se actualiza una existente.
- **🌐 Interfaz amigable:** La aplicación tiene una interfaz sencilla y fácil de usar tanto para administradores como para usuarios.
- **🔒 Seguridad:** Los administradores tienen un acceso completo, mientras que los usuarios solo pueden ver y gestionar sus propias tareas.

## **🛠️ Tecnologías utilizadas**

- **Frontend:**
  - 🖥️ **React.js:** Para crear una interfaz de usuario interactiva.
  - 🎨 **CSS3/HTML5:** Para el diseño y la estructura visual de la aplicación.
  - 🌐 **Axios:** Para realizar peticiones HTTP al backend.

- **Backend:**
  - 🚀 **Node.js:** Para la ejecución del backend en JavaScript.
  - 🛠️ **Express.js:** Framework para la creación de rutas y manejo de peticiones HTTP.
  - 🔗 **Sequelize:** ORM para interactuar con la base de datos SQL.
  - 💾 **MySQL/SQLite:** Base de datos para almacenar tareas, usuarios y asignaciones.

## **⚙️ Instalación**

### **1. Clonar el repositorio**

```bash
git clone https://github.com/usuario/administrador-tareas.git
