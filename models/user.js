// requerimos la dependencia de mongoose para poder trabajar con mongodb

const mongoose = require('mongoose');

// Creo la trabla o schema del modelo que tiene las propiedades, se especifica si es string, booleano, numero, ect

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    verified: {
        type: Boolean,
        default: false
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }]
});

// Configuro la respuesta del usuario borrando el id, la version y la contraseña

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

// Le damos un nombre y lo asignamos a una propiedad

const User = mongoose.model('User', userSchema);

// Lo exportamos

module.exports = User;