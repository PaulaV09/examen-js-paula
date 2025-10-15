# 🏨 Sistema de Reservas de Hotel

Este proyecto es una **aplicación web interactiva** desarrollada con **JavaScript nativo y Web Components**, que permite gestionar **habitaciones, reservas y usuarios** de un hotel.  
Incluye una interfaz visual moderna, un panel de administración, y conexión con una API simulada mediante **JSON Server**.

---

## 🚀 Características principales

- 🔐 **Autenticación de usuarios** (rol `user` y `admin`)
- 🏠 **Exploración de habitaciones** por categoría (Estándar, Deluxe, Suite y Presidencial)
- 📅 **Reservas dinámicas** con cálculo automático del precio total
- ⚙️ **Panel de administración** para gestionar habitaciones y reservas
- 📱 **Diseño responsive** completamente adaptado a móviles (hasta 400px)
- 🧩 **Uso de Web Components** (arquitectura modular)
- 💾 **Persistencia de datos** con JSON Server
- 🧠 **Interfaz moderna y accesible**, basada en tipografías Poppins y Playfair Display

---

## 🧱 Estructura del proyecto

```
📁 hotel-reservas/
│
├── 📁 assets/ #imagenes 
│
├── 📁 css/ #estilos dentro de la pagina
│
├── 📁 db/ #archivo json con la base de datos ejemplo
│
├── 📁 js/ #logica backend
│ └── api/ #crudApi
│ └── components/ #componentes web del proyecto
│ └── models/ #modelos de datos
|
├── 📁 pages/ #paginas html
│ └── admin/ #vistas del admin
│ └── public/ #login y registro
│ └── user/ #vistas de usuario
|
├── 📁 src/ #main.js
|
├── index.html # Página principal
└── README.md # Documentación del proyecto
```



---

## 🧠 Tecnologías utilizadas

| Tecnología                           | Uso                                      |
| ------------------------------------ | ---------------------------------------- |
| **HTML5 / CSS3**                     | Estructura y diseño visual del proyecto  |
| **JavaScript (ES6+)**                | Lógica principal y componentes dinámicos |
| **Web Components**                   | Modularización de las vistas             |
| **JSON Server**                      | Simulación de una API RESTful local      |
| **Fetch API**                        | Comunicación con el backend simulado     |
| **Font: Poppins & Playfair Display** | Tipografía moderna y elegante            |
| **Responsive Design**                | Adaptación a pantallas menores de 400px  |

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tuusuario/hotel-reservas.git
cd hotel-reservas
```

### 2️⃣ Instalar JSON Server

```
npm install -g json-server
```

### 3️⃣ Ejecutar el servidor de datos

```
json-server --watch db.json --port 3000
```

### 4️⃣ Abrir el proyecto

Abre index.html en tu navegador o usa una extensión de servidor local como Live Server en Visual Studio Code.

### Visualizar directamente

[https://sparkling-strudel-ad93fc.netlify.app/](Ir al sitio web)

## 🗂️ Base de datos (db.json)

La base de datos contiene tres colecciones principales:

### 👤 Users

```
{
  "identificacion": "99999999",
  "fullName": "Admin Hotel",
  "email": "admin@hotel.com",
  "role": "admin",
  "id": 2
}
```

### 🏠 Rooms

Cada habitación contiene:

```
title, slug, description, beds, pricePerNight, services, images, active.
```

### 📅 Bookings

Cada reserva contiene:

```
roomId, userId, startDate, endDate, totalPrice, status.
```

### 💻 CRUD API (crudApi.js)

Módulo reutilizable para operaciones con JSON Server:

```
export const getInfo = async (resource) => { ... };
export const postInfo = async (resource, data) => { ... };
export const putInfo = async (resource, id, data) => { ... };
export const deleteInfo = async (resource, id) => { ... };
```

## 🧩 Funcionalidades del sistema

### 👤 Usuario

- Ver habitaciones disponibles
- Realizar y consultar reservas

- Ver estado de sus reservas (pendiente, confirmada, cancelada)


### 🧑‍💼 Administrador

- Crear, editar y eliminar habitaciones
- Confirmar o cancelar reservas

- Consultar historial de usuarios


## 📊 Ejemplo de flujo

1. El usuario selecciona una habitación desde el landing.
2. Se abre el detalle de la habitación (detalle-component).

3. Ingresa fechas, cantidad de huéspedes y confirma la reserva.

4. La reserva se guarda en db.json vía POST /bookings.

5. El administrador puede actualizar su estado desde el panel.


## 🧾 Licencia

Este proyecto fue desarrollado con fines académicos.
Puedes usarlo, modificarlo y adaptarlo libremente citando al autor original.

## ✨ Autora

👩‍💻 Paula Andrea Viviescas Jaimes
Ingeniera de Sistemas
📧 paulaajaiimes09@gmail.com
🌐 Proyecto educativo desarrollado como práctica de JavaScript con Web Components.