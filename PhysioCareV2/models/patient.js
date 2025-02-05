const mongoose = require('mongoose');

let patientSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        minlenght:3,
        maxlenght:50,
        trim:true,
    },
    surname:{
        type:String,
        require:true,
        minlenght:3,
        maxlenght:50,
        trim:true,
    },
    birthDate:{
        type:Date,
        require:true,
    },
    address:{
        type:String,
        maxlenght:100,
        trim:true,
    },
    insuranceNumber:{
        type:String,
        require:true,
        unique:true,
        match:[/^[a-zA-Z0-9]{9}$/,'El número de seguro debe tener 9 caracteres alfanuméricos']
    },
})
let Patient = mongoose.model('patient',patientSchema)
module.exports = Patient