const express = require('express');
let router = express.Router();

const User = require(__dirname + '/../models/users');
const Auth = require(__dirname+'/../auth/auth');
// Ruta para manejar el inicio de sesión
router.post("/login",(req,res)=>{
    const { login, password } = req.body;
    User.findOne({login:login}).then((usuario)=>{
        const {login,password,rol} = usuario;
        res.status(200).send({ok: true, token: Auth.generarToken(login,rol)})
    }).catch((error)=>{
        res.status(401).send({ok: false, resultado:"Login incorrecto"});
    });
});

module.exports = router;