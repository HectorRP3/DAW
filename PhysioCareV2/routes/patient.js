const express = require('express');
const { protegerRuta,validarToken } = require('../auth/auth');
let router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const Patient = require(__dirname + '/../models/patient');
const User = require(__dirname + '/../models/users');
const Auth = require(__dirname+'/../auth/auth');

router.get('/', protegerRuta(['admin','physio']), async (req, res) => {
    Patient.find()
        .then((result) => {
            console.log("entrando");
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            if(res.length === 0){
                res.status(404).send({ok: false, error: "Patient not found"});
             }else{
                res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});

router.get('/find', protegerRuta(['admin','physio']), async (req, res) => {
    let result
    const {surname} = req.query;
    try{
        if(surname){
            result = await Patient.find({surname: {
                $regex:surname
            }});
        }else{
            result = await Patient.find();
        }
        res.status(200).send({ok: true, resultado: result});
    }catch(err){
        if(res.length === 0){
            res.status(404).send({ok: false, error: "Patient not found"});
        }else{
            res.status(500).send({ok: false, error: "Internal server error"});
        }
    }
});

router.get('/:id', protegerRuta(['admin','physio','patient']), async (req, res) => {
    let {id} = req.params.id;
    let user = req.user.login;
    let userRole = req.user.rol;
    
    if(userRole !== 'admin' && userRole !== 'physio'){
        let userID= await Patient.findOne({name:user}).then((result) => {
            u = result._id.toString();
            return u;
        });
        if(userRole === 'patient' && req.params.id !== userID){
            return res.status(403).send({ok: false, error: "Only the patient can see his/her own data"});
        }
    }
    Patient.findById(req.params.id)
        .then((result) => {
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            if(res.length === 0){
                res.status(404).send({ok: false, error: "Patient not found"});
             }else{
             res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});

router.post('/',protegerRuta(['admin','physio']), async (req, res) => {
    const {name, surname, birthDate, address, insuranceNumber} = req.body;
    const newPatient = new Patient({
        name,
        surname,
        birthDate,
        address,
        insuranceNumber
    });
    newPatient.save()
        .then((result) => {
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            res.status(500).send({ok: false, error: "Internal server error"});
        });
});

router.put('/:id',protegerRuta(['admin','physio']), async (req, res) => {
    const {name, surname, birthDate, address, insuranceNumber} = req.body;
    Patient.findByIdAndUpdate(req.params.id, {
        name,
        surname,
        birthDate,
        address,
        insuranceNumber
    }, {new: true})
        .then((result) => {
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            if(res.length === 0){
                res.status(404).send({ok: false, error: "Patient not found"});
             }else{
             res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});

router.delete('/:id',protegerRuta(['admin','physio']), async (req, res) => {
    Patient.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            if(res.length === 0){
                res.status(404).send({ok: false, error: "Patient not found"});
             }else{
             res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});



module.exports = router;