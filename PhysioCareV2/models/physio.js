const mongoose = require("mongoose")

let physioSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        minlenght:2,
        maxlenght:50,
        trim:true,
    },
    surname:{
        type:String,
        require:true,
        minlenght:2,
        maxlenght:50,
        trim:true,
    },
    specialty:{
        type:String,
        require:true,
        enum: ['Sports','Neurological','Pediatric','Geriatric', 'Oncological']
    },
    licenseNumber:{
        type:String,
        require:true,
        unique:true,
        match:[/^[a-zA-Z0-9]{8}$/,'El número de seguro debe tener 9 caracteres alfanuméricos']
    },
})

let Physio = mongoose.model('Physio',physioSchema)
module.exports = Physio
