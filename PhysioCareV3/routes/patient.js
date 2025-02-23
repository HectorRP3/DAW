const express = require("express");
let router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const Patient = require(__dirname + "/../models/patient");
const User = require(__dirname + "/../models/users");
const upload = require(__dirname + "/../utils/uploads");

router.get("/", (req, res) => {
  Patient.find()
    .then((result) => {
      res.render("../views/Patients/patients_list", { patients: result });
    })
    .catch((err) => {
      res.render("error", { error: "Error listando contactos" });
    });
});

router.get("/find", async (req, res) => {
  Patient.find({ surname: { $regex: req.query.surname, $options: "i" } })
    .then((result) => {
      if (result.length) {
        res.render("../views/Patients/patients_list", { patients: result });
      } else {
        res.render("../views/error.njk", { error: "Patient not found" });
      }
    })
    .catch((err) => {
      res.render("../views/error.njk", { error: "Error listando contactos" });
    });
});

// router.get("/find", async (req, res) => {
//   let result;
//   const { surname } = req.query;
//   try {
//     if (surname) {
//       result = await Patient.find({
//         surname: {
//           $regex: surname,
//         },
//       });
//     } else {
//       result = await Patient.find();
//     }
//     res.status(200).send({ ok: true, resultado: result });
//   } catch (err) {
//     if (res.length === 0) {
//       res.status(404).send({ ok: false, error: "Patient not found" });
//     } else {
//       res.status(500).send({ ok: false, error: "Internal server error" });
//     }
//   }
// });

// router.get("/:id", async (req, res) => {
//   let { id } = req.params.id;
//   let user = req.user.login;
//   let userRole = req.user.rol;

//   if (userRole !== "admin" && userRole !== "physio") {
//     let userID = await Patient.findOne({ name: user }).then((result) => {
//       u = result._id.toString();
//       return u;
//     });
//     if (userRole === "patient" && req.params.id !== userID) {
//       return res.status(403).send({
//         ok: false,
//         error: "Only the patient can see his/her own data",
//       });
//     }
//   }
//   Patient.findById(req.params.id)
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Patient not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.post("/", async (req, res) => {
//   const { name, surname, birthDate, address, insuranceNumber } = req.body;
//   const newPatient = new Patient({
//     name,
//     surname,
//     birthDate,
//     address,
//     insuranceNumber,
//   });
//   newPatient
//     .save()
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       res.status(500).send({ ok: false, error: "Internal server error" });
//     });
// });

// router.put("/:id", async (req, res) => {
//   const { name, surname, birthDate, address, insuranceNumber } = req.body;
//   Patient.findByIdAndUpdate(
//     req.params.id,
//     {
//       name,
//       surname,
//       birthDate,
//       address,
//       insuranceNumber,
//     },
//     { new: true }
//   )
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Patient not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });
router.get("/new", (req, res) => {
  res.render("../views/Patients/patient_add.njk");
});
router.get("/:id/edit", async (req, res) => {
  Patient.findById(req.params["id"])
    .then((result) => {
      res.render("../views/Patients/patient_edit.njk", { patient: result });
    })
    .catch((err) => {
      res.render("error", { error: "Error mostrando patient" });
    });
});

router.get("/:id", (req, res) => {
  Patient.findById(req.params.id)
    .then((result) => {
      res.render("../views/Patients/patient_detail.njk", { patient: result });
    })
    .catch((err) => {
      res.render("error", { error: "Error mostrando paciente" });
    });
});

router.delete("/:id", (req, res) => {
  Patient.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.redirect("/patients");
    })
    .catch((err) => {
      res.render("error", { error: "Error borrando paciente" });
    });
});

router.post("/", upload.single("image"), async (req, res) => {
  const newPatient = new Patient({
    name: req.body.name,
    surname: req.body.surname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    insuranceNumber: req.body.insuranceNumber,
  });
  if (req.file) newPatient.image = req.file.filename;

  newPatient
    .save()
    .then((result) => {
      res.redirect("/patients/" + result.id);
    })
    .catch((err) => {
      let errores = {
        general: "Error al crear el paciente",
      };
      if (err.code === 11000) {
        if (err.keyPattern.insuranceNumber)
          errores.insuranceNumber = "The number of insurance already exists";
      } else {
        if (err.errors.name) errores.name = err.errors.name.message;
        if (err.errors.surname) errores.surname = err.errors.surname.message;
        if (err.errors.birthDate)
          errores.birthDate = err.errors.birthDate.message;
        if (err.errors.address) errores.address = err.errors.address.message;
        if (err.errors.insuranceNumber)
          errores.insuranceNumber = err.errors.insuranceNumber.message;
      }
      res.render("../views/Patients/patient_add.njk", { errores });
    });
});

router.post("/:id", upload.single("image"), async (req, res) => {
  let newImagen = "";
  if (req.file) newImagen = req.file.filename;
  Patient.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber,
        image: newImagen,
      },
    },
    { new: true, runValidators: true }
  )
    .then((result) => {
      res.redirect("/patients/" + result.id);
    })
    .catch((err) => {
      let errores = {
        general: "Error al actualizar el paciente",
      };
      if (err.code === 11000) {
        if (err.keyPattern.insuranceNumber)
          errores.insuranceNumber = "The number of insurance already exists";
      } else {
        if (err.errors.name) errores.name = err.errors.name.message;
        if (err.errors.surname) errores.surname = err.errors.surname.message;
        if (err.errors.birthDate)
          errores.birthDate = err.errors.birthDate.message;
        if (err.errors.address) errores.address = err.errors.address.message;
        if (err.errors.insuranceNumber)
          errores.insuranceNumber = err.errors.insuranceNumber.message;
      }
      res.render("../views/Patients/patient_edit.njk", {
        errores,
        patient: {
          id: req.params.id,
          name: req.body.name,
          surname: req.body.surname,
          birthDate: req.body.birthDate,
          address: req.body.address,
          insuranceNumber: req.body.insuranceNumber,
          image: newImagen,
        },
      });
    });
});

// router.delete("/:id", async (req, res) => {
//   Patient.findByIdAndDelete(req.params.id)
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Patient not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

module.exports = router;
