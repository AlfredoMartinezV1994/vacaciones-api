# 🌴 API de Vacaciones 🌴

## 📄 Descripción
Esta API permite gestionar vacaciones mediante métodos HTTP. Ahora utiliza **SQLite** como base de datos para almacenar los registros de vacaciones, ofreciendo mayor robustez y flexibilidad.

## 🌐 Endpoints
### 📋 GET /vacaciones
Devuelve la lista completa de vacaciones.

### 🔍 GET /vacaciones/:id
Devuelve un registro de vacaciones específico por su ID.

### ➕ POST /vacaciones
Crea un nuevo registro de vacaciones.  
**Body JSON ejemplo:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "fecha_inicial": "2025-09-10",
  "fecha_final": "2025-09-20"
}
```

### ✏️ PUT /vacaciones/:id
Actualiza un registro de vacaciones específico por su ID.  
**Body JSON igual al POST.**

### 🗑️ DELETE /vacaciones/:id
Elimina un registro de vacaciones específico por su ID.

## 🛠️ Instalación
1. Clona el repositorio:  
   ```bash
   git clone https://github.com/ramiroec/vacaciones-api.git
   ```
2. Instala las dependencias:  
   ```bash
   npm install
   ```
3. Inicia la API:  
   ```bash
   npm start
   ```
   O para desarrollo con recarga automática:
   ```bash
   npm run dev
   ```

## 🚀 Uso
La API se encuentra disponible en `http://localhost:3000`.  
Puedes utilizar herramientas como **Postman** o **cURL** para interactuar con la API.

## 📁 Estructura del proyecto
- **app.js**: Archivo principal de la API.
- **index.html**: Página principal de la aplicación.
- **calendario.html**: Página de calendario de la aplicación.
- **vacaciones.db**: Base de datos SQLite con los registros de vacaciones.

## 📜 Licencia
Este proyecto se encuentra bajo la licencia ISC.

## 👤 Autor
Ramiro Estigarribia Canese

## 🤝 Contribuciones
Si deseas contribuir a este proyecto, por favor, crea un pull request con tus cambios.
