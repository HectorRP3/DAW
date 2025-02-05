const express = require('express');
let router = express.Router();

const Physio = require(__dirname + '/../models/physio');

router.get('/', async (req, res) => {
    Physio.find()
        .then((result) => {
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            if(res.length === 0){
                res.status(404).send({ok: false, error: "Physio not found"});
             }else{
             res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});

router.get('/find', async (req, res) => {
    let result
    const {specialty} = req.query;
    try{
        if(specialty){
            result = await Physio.find({specialty: {
                $regex:specialty
            }});
        }else{
            result = await Physio.find();
        }
        res.status(200).send({ok: true, resultado: result});
    }catch(err){
        if(res.length === 0){
            res.status(404).send({ok: false, error: "Physio not found"});
        }else{
         res.status(500).send({ok: false, error: "Internal server error"});
        }
    }
});

router.get('/:id', async (req, res) => {
    Physio.findById(req.params.id)
        .then((result) => {
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            if(res.length === 0){
                res.status(404).send({ok: false, error: "Physio not found"});
             }else{
             res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});

router.post('/', async (req, res) => {
    const {name, surname, birthDate, address, insuranceNumber} = req.body;
    const newPhysio = new Physio({
        name,
        surname,
        birthDate,
        address,
        insuranceNumber
    });
    newPhysio.save()
        .then((result) => {
            res.status(201).send({ok: true, resultado: result});
        }).catch((err) => {
            res.status(500).send({ok: false, error: "Internal server error"});
        });
});

router.put('/:id', async (req, res) => {
    const {name, surname, birthDate, address, insuranceNumber} = req.body;
    Physio.findByIdAndUpdate(req.params.id, {
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
                res.status(404).send({ok: false, error: "Physio not found"});
             }else{
             res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});

router.delete('/:id', async (req, res) => {
    Physio.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).send({ok: true, resultado: result});
        }).catch((err) => {
            if(res.length === 0){
                res.status(404).send({ok: false, error: "Physio not found"});
             }else{
             res.status(500).send({ok: false, error: "Internal server error"});
             }
        });
});

module.exports = router;