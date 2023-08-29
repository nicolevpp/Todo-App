// Siempre se llaman los controles igual que los modelos para guiarse

// Router: registrar los get, post, delete, patch, todo del controlador

const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');


// Post: crear recursos en el servidor

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;
    
    if (!name || !email || !password) {
        return response.status(400).json({error: 'Todos los espacios son requeridos'});
    }

    const userExist = await User.findOne({email});

    if (userExist) {
        return response.status(400).json({error: 'El email ya se encuentra en uso'});
    }

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const newUser = new User({
        name,
        email,
        passwordHash,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign( { id: savedUser.id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: savedUser.email, // list of receivers
      subject: "Verificación de usuario", // Subject line
      html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`, // html body
    });

    return response.status(201).json('Usuario creado. Por favor verifica tu correo');
  

});

usersRouter.patch('/:id/:token', async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decodedToken.id;
        await User.findByIdAndUpdate(id, { verified: true});
        return response.sendStatus(200);
    } catch (error) {

        // Encontrar el email del usuario
        const id = request.params.id;
        const { email } = await User.findById(id);

        // Firmar el nuevo token 
        const token = jwt.sign( { id: id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        // Enviar el email
    
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
    
    await transporter.sendMail({
          from: process.env.EMAIL_USER, // sender address
          to: email, // list of receivers
          subject: "Verificación de usuario", // Subject line
          html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar correo</a>`, // html body
        });

        return response.status(400).json({error: 'El link ya expiró. Se ha enviado un nuevo link de verificación a su correo'})
    }
});

module.exports = usersRouter;


