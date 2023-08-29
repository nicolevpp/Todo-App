const app = require('./app');
const http = require('http');

const server = http.createServer(app);

// el servidor escucha y seleccionamos el puerto
server.listen(3003, () => {
    console.log('El servidor esta corriendo');
});

// para probarlo necesitamos la dependencia nodemon