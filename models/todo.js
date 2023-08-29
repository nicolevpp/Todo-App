// requerimos la dependencia de mongoose para poder trabajar con mongodb

const mongoose = require('mongoose');

// Creo la trabla o schema del modelo que tiene las propiedades, se especifica si es string, booleano, numero, ect

const todoSchema = new mongoose.Schema({
    text: String,
    checked: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

// Configuro la respuesta del usuario borrando el id, la version y la contraseña

todoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

// Le damos un nombre y lo asignamos a una propiedad

const Todo = mongoose.model('Todo', todoSchema);

// Lo exportamos

module.exports = Todo;