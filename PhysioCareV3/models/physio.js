const mongoose = require("mongoose");

let physioSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "El campo es requirido"],
    minlength: [2, "El campo debe tene min 2 letras"],
    maxlength: [50, "El campo debe tene max 50 letras"],
    trim: true,
  },
  surname: {
    type: String,
    require: [true, "El campo es requirido"],
    minlength: [2, "El campo debe tene min 2 letras"],
    maxlength: [50, "El campo debe tene max 50 letras"],
    trim: true,
  },
  specialty: {
    type: String,
    require: [true, "El campo es requirido"],
    enum: ["Sports", "Neurological", "Pediatric", "Geriatric", "Oncological"],
  },
  licenseNumber: {
    type: String,
    require: [true, "El campo es requirido"],
    unique: [true, "El número de seguro ya existe"],
    match: [
      /^[a-zA-Z0-9]{8}$/,
      "El número de seguro debe tener 9 caracteres alfanuméricos",
    ],
  },
  image: {
    type: String,
    require: [true, "El campo es requirido"],
  },
});

let Physio = mongoose.model("Physio", physioSchema);
module.exports = Physio;
