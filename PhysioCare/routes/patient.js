const express = require('express');
let router = express.Router();

const Patient = require(__dirname + '/../models/patient');

router.get('/', async (req, res) => {
    Patient.find()
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

router.get('/find', async (req, res) => {
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

router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
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
            res.status(201).send({ok: true, resultado: result});
        }).catch((err) => {
            res.status(500).send({ok: false, error: "Internal server error"});
        });
});

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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