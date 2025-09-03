// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear una instancia de la aplicación Express
const app = express();
const port = 3000;

// Inicializar la base de datos SQLite
const db = new sqlite3.Database('./vacaciones.db');

// Crear la tabla si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS vacaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        apellido TEXT,
        fecha_inicial TEXT,
        fecha_final TEXT
    )`);
});

// Middleware para parsear cuerpos de solicitudes en formato JSON
app.use(bodyParser.json());

// Middleware para registrar accesos a la API
app.use((req, res, next) => {
    const fecha = new Date().toLocaleString();
    console.log(`[${fecha}] Acceso: ${req.method} ${req.originalUrl} desde IP: ${req.ip}`);
    next();
});

// Ruta principal - Envía el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para la página de calendario - Envía el archivo HTML de calendario
app.get('/calendario', (req, res) => {
    res.sendFile(path.join(__dirname, 'calendario.html'));
});

// Ruta para obtener todas las vacaciones
app.get('/vacaciones', (req, res) => {
    db.all('SELECT * FROM vacaciones', [], (err, rows) => {
        if (err) return res.status(500).send('Error de base de datos');
        res.json(rows);
    });
});

// Ruta para obtener una sola vacación por ID
app.get('/vacaciones/:id', (req, res) => {
    db.get('SELECT * FROM vacaciones WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).send('Error de base de datos');
        if (row) res.json(row);
        else res.status(404).send('Registro no encontrado');
    });
});

// Ruta para agregar una nueva vacación
app.post('/vacaciones', (req, res) => {
    const { nombre, apellido, fecha_inicial, fecha_final } = req.body;
    db.run(
        'INSERT INTO vacaciones (nombre, apellido, fecha_inicial, fecha_final) VALUES (?, ?, ?, ?)',
        [nombre, apellido, fecha_inicial, fecha_final],
        function (err) {
            if (err) return res.status(500).send('Error de base de datos');
            db.get('SELECT * FROM vacaciones WHERE id = ?', [this.lastID], (err, row) => {
                if (err) return res.status(500).send('Error de base de datos');
                res.status(201).json(row);
            });
        }
    );
});

// Ruta para actualizar una vacación existente
app.put('/vacaciones/:id', (req, res) => {
    const { nombre, apellido, fecha_inicial, fecha_final } = req.body;
    db.run(
        'UPDATE vacaciones SET nombre = ?, apellido = ?, fecha_inicial = ?, fecha_final = ? WHERE id = ?',
        [nombre, apellido, fecha_inicial, fecha_final, req.params.id],
        function (err) {
            if (err) return res.status(500).send('Error de base de datos');
            if (this.changes === 0) return res.status(404).send('Registro no encontrado');
            db.get('SELECT * FROM vacaciones WHERE id = ?', [req.params.id], (err, row) => {
                if (err) return res.status(500).send('Error de base de datos');
                res.json(row);
            });
        }
    );
});

// Ruta para eliminar una vacación
app.delete('/vacaciones/:id', (req, res) => {
    db.run('DELETE FROM vacaciones WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).send('Error de base de datos');
        if (this.changes === 0) return res.status(404).send('Registro no encontrado');
        res.status(204).send();
    });
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
