# Sistema de Registro - API Server

API REST desarrollada con Node.js, Express, TypeScript y Microsoft SQL Server para la gestión de productos/tarjetas y autenticación de usuarios.

---

## Estructura del Proyecto

```text
Server/
├── db/
│   └── urbans.sql           # Script de creación de base de datos y tablas
├── src/
│   ├── Controller/
│   │   ├── Autenticacion.ts # Registro y login con bcrypt
│   │   └── Productos.ts     # Lógica de controladores de productos
│   ├── Interface/
│   │   └── interface.db.ts  # Definiciones de tipos e interfaces de TypeScript
│   ├── Router/
│   │   ├── Autenticacion.route.ts # Endpoints de autenticación
│   │   └── Productos.route.ts # Definición de rutas/endpoints de productos
│   └── Index.ts             # Punto de entrada de la aplicación Express
├── package.json
└── tsconfig.json
```

## Autenticación

Ejecuta el script `Server/db/urbans.sql` antes de usar estos endpoints:

- `POST /api/auth/register` con `{ "nombre": "...", "email": "...", "contrasena": "..." }`
- `POST /api/auth/login` con `{ "email": "...", "contrasena": "..." }`

Las contraseñas se almacenan únicamente como hashes generados con bcrypt. El inicio de sesión verifica la contraseña y devuelve los datos básicos del usuario.

## Productos

- `GET /api/Productos` lista los productos.
- `POST /api/Registrar` carga un producto.
- `PUT /api/Modificar/:Id` modifica un producto.
- `DELETE /api/Eliminar/:Id` elimina un producto.