const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');

app.use(bodyParser.json());

const filePath = './vacaciones.json';

function readDatabase() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function writeDatabase(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Ruta principal
app.get('/', (req, res) => {
    console.log('Acceso a la ruta principal /');
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// Calendario.html
app.get('/calendario', (req, res) => {
    console.log('Acceso a la ruta principal /');
    res.sendFile(path.join(__dirname, 'calendario.html'));
  });


app.get('/vacaciones', (req, res) => {
    const data = readDatabase();
    res.json(data);
});

app.get('/vacaciones/:id', (req, res) => {
    const data = readDatabase();
    const registro = data.find(item => item.id === parseInt(req.params.id));
    if (registro) {
        res.json(registro);
    } else {
        res.status(404).send('Registro no encontrado');
    }
});

app.post('/vacaciones', (req, res) => {
    const data = readDatabase();
    const newRegistro = {
        id: data.length ? data[data.length - 1].id + 1 : 1,
        ...req.body
    };
    data.push(newRegistro);
    writeDatabase(data);
    res.status(201).json(newRegistro);
});

app.put('/vacaciones/:id', (req, res) => {
    const data = readDatabase();
    const index = data.findIndex(item => item.id === parseInt(req.params.id));
    if (index !== -1) {
        data[index] = { id: parseInt(req.params.id), ...req.body };
        writeDatabase(data);
        res.json(data[index]);
    } else {
        res.status(404).send('Registro no encontrado');
    }
});

app.delete('/vacaciones/:id', (req, res) => {
    const data = readDatabase();
    const newData = data.filter(item => item.id !== parseInt(req.params.id));
    if (newData.length !== data.length) {
        writeDatabase(newData);
        res.status(204).send();
    } else {
        res.status(404).send('Registro no encontrado');
    }
});

app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
