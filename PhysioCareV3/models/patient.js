const mongoose = require("mongoose");

let patientSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "El campo es requirido"],
    minlength: [3, "El campo debe tene min 3 letras"],
    maxlength: [50, "El campo debe tene max 50 letras"],
    trim: true,
  },
  surname: {
    type: String,
    require: [true, "El campo es requirido"],
    minlength: [3, "El campo debe tene min 3 letras"],
    maxlength: [50, "El campo debe tene max 50 letras"],
    trim: true,
  },
  birthDate: {
    type: Date,
    require: [true, "El campo es requirido"],
  },
  address: {
    type: String,
    maxlength: [100, "El campo debe tene max 100 letras"],
    trim: true,
  },
  insuranceNumber: {
    type: String,
    require: [true, "El campo es requirido"],
    unique: [true, "El número de seguro ya existe"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]{9}$/.test(v);
      },
      message: "El número de seguro debe tener 9 caracteres alfanuméricos",
    },
    match: [
      /^[a-zA-Z0-9]{9}$/,
      "El número de seguro debe tener 9 caracteres alfanuméricos",
    ],
  },
  image: {
    type: String,
    require: [true, "El campo es requirido"],
  },
});
let Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
