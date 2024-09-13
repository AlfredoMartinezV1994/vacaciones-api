// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Crear una instancia de la aplicación Express
const app = express();
const port = 3000;

// Ruta del archivo JSON que actúa como nuestra base de datos
const filePath = './vacaciones.json';

// Middleware para parsear cuerpos de solicitudes en formato JSON
app.use(bodyParser.json());

// Función para leer los datos de la "base de datos" (archivo JSON)
function readDatabase() {
    // Leer el archivo JSON y parsear su contenido
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// Función para escribir datos en la "base de datos" (archivo JSON)
function writeDatabase(data) {
    // Convertir los datos a formato JSON y escribirlos en el archivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Ruta principal - Envía el archivo HTML principal
app.get('/', (req, res) => {
    console.log('Acceso a la ruta principal /');
    // Enviar el archivo 'index.html' como respuesta
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para la página de calendario - Envía el archivo HTML de calendario
app.get('/calendario', (req, res) => {
    console.log('Acceso a la ruta de calendario /calendario');
    // Enviar el archivo 'calendario.html' como respuesta
    res.sendFile(path.join(__dirname, 'calendario.html'));
});

// Ruta para obtener todas las vacaciones - Envía todos los registros de vacaciones
app.get('/vacaciones', (req, res) => {
    // Leer datos de la "base de datos"
    const data = readDatabase();
    // Enviar los datos como JSON
    res.json(data);
});

// Ruta para obtener una sola vacación por ID - Envía el registro correspondiente
app.get('/vacaciones/:id', (req, res) => {
    // Leer datos de la "base de datos"
    const data = readDatabase();
    // Buscar el registro por ID
    const registro = data.find(item => item.id === parseInt(req.params.id));
    // Verificar si el registro fue encontrado
    if (registro) {
        // Enviar el registro como JSON
        res.json(registro);
    } else {
        // Enviar un error 404 si el registro no fue encontrado
        res.status(404).send('Registro no encontrado');
    }
});

// Ruta para agregar una nueva vacación - Añade un nuevo registro
app.post('/vacaciones', (req, res) => {
    // Leer datos de la "base de datos"
    const data = readDatabase();
    // Crear un nuevo registro con un ID único
    const newRegistro = {
        id: data.length ? data[data.length - 1].id + 1 : 1,
        ...req.body
    };
    // Agregar el nuevo registro a la lista de registros
    data.push(newRegistro);
    // Escribir los datos actualizados en la "base de datos"
    writeDatabase(data);
    // Enviar el nuevo registro como JSON con el código de estado 201 (Creado)
    res.status(201).json(newRegistro);
});

// Ruta para actualizar una vacación existente - Modifica un registro existente
app.put('/vacaciones/:id', (req, res) => {
    // Leer datos de la "base de datos"
    const data = readDatabase();
    // Encontrar el índice del registro que corresponde al ID proporcionado
    const index = data.findIndex(item => item.id === parseInt(req.params.id));
    // Verificar si el registro fue encontrado
    if (index !== -1) {
        // Actualizar el registro con los nuevos datos
        data[index] = { id: parseInt(req.params.id), ...req.body };
        // Escribir los datos actualizados en la "base de datos"
        writeDatabase(data);
        // Enviar el registro actualizado como JSON
        res.json(data[index]);
    } else {
        // Enviar un error 404 si el registro no fue encontrado
        res.status(404).send('Registro no encontrado');
    }
});

// Ruta para eliminar una vacación - Elimina un registro existente
app.delete('/vacaciones/:id', (req, res) => {
    // Leer datos de la "base de datos"
    const data = readDatabase();
    // Filtrar los registros para excluir el que corresponde al ID proporcionado
    const newData = data.filter(item => item.id !== parseInt(req.params.id));
    // Verificar si se realizó una eliminación
    if (newData.length !== data.length) {
        // Escribir los datos actualizados en la "base de datos"
        writeDatabase(newData);
        // Enviar una respuesta con código de estado 204 (Sin contenido)
        res.status(204).send();
    } else {
        // Enviar un error 404 si el registro no fue encontrado
        res.status(404).send('Registro no encontrado');
    }
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
