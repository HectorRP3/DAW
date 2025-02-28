const mongoose = require("mongoose");
let appointmentsSchema = new mongoose.Schema({
  date: {
    type: Date,
    require: [true, "La fecha es requerida"],
  },
  physio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "physio",
    require: [true, "El fisioterapeuta es requerido"],
  },
  diagnosis: {
    type: String,
    require: [true, "El diagnóstico es requerido"],
    trim: true,
    maxlength: [500, "El diagnóstico no puede tener más de 500 caracteres"],
    minlength: [10, "El diagnóstico no puede tener menos de 10 caracteres"],
  },
  treatment: {
    type: String,
    require: [true, "El tratamiento es requerido"],
    trim: true,
  },
  observations: {
    type: String,
    minlength: [500, "El campo no puede tener más de 500 caracteres"],
  },
});
let recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    require: [true, "El paciente es requerido"],
  },
  medicalRecord: {
    type: String,
    require: true,
    maxlength: [1000, "El campo no puede tener más de 1000 caracteres"],
  },
  appointments: [appointmentsSchema],
});

let Record = mongoose.model("record", recordSchema);
module.exports = Record;
