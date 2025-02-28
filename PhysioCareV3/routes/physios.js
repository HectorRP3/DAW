const express = require("express");
const { recompileSchema } = require("../models/physio");
const Patient = require("../models/patient");
let router = express.Router();
const upload = require(__dirname + "/../utils/uploads");

const Physio = require(__dirname + "/../models/physio");

router.get("/new", (req, res) => {
  res.render("../views/Physios/physio_add.njk");
});

router.get("/", (req, res) => {
  Physio.find()
    .then((result) => {
      res.render("../views/Physios/physios_list", { physios: result });
    })
    .catch((err) => {
      res.render("error", { error: "Error listando contactos" });
    });
});

router.get("/find", async (req, res) => {
  Physio.find({
    specialty: { $regex: req.query.specialty, $options: "i" },
  })
    .then((result) => {
      if (result.length) {
        res.render("../views/Physios/physios_list.njk", { physios: result });
      } else {
        res.render("../views/error.njk", {
          error:
            "No se encontraron fisioterapeutas con la especialidad indicada",
        });
      }
    })
    .catch((err) => {
      res.render("../views/error.njk", { error: "Error listando physios" });
    });
});

router.get("/:id/edit", async (req, res) => {
  Physio.findById(req.params["id"])
    .then((result) => {
      res.render("../views/Physios/physio_edit.njk", { physio: result });
    })
    .catch((err) => {
      res.render("error", { error: "Error al redirigir a editar" });
    });
});

router.get("/:id", (req, res) => {
  Physio.findById(req.params.id)
    .then((result) => {
      res.render("../views/Physios/physio_detail.njk", { physio: result });
    })
    .catch((err) => {
      res.render("error", { err: "Error al mostrar physio" });
    });
});

router.delete("/:id", (req, res) => {
  Physio.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.redirect("/physios");
    })
    .catch((err) => {
      res.render("error", { error: "Error borrando physio" });
    });
});

router.post("/", upload.single("image"), async (req, res) => {
  const newPhysio = new Physio({
    name: req.body.name,
    surname: req.body.surname,
    specialty: req.body.specialty,
    licenseNumber: req.body.licensenumber,
  });
  if (req.file) newPhysio.image = req.file.filename;
  newPhysio
    .save()
    .then((result) => {
      res.redirect("/physios/" + result.id);
    })
    .catch((err) => {
      let errores = {
        general: "Error al crear el physio",
      };
      if (err.code === 11000) {
        if (err.keyPattern.licenseNumber) {
          errores.licenseNumber = "The number of insuarannce already exists";
        }
      } else {
        if (err.errors.name) errores.name = err.errors.name.message;
        if (err.errors.surname) errores.surname = err.errors.surname.message;
        if (err.errors.specialty)
          errores.specialty = err.errors.specialty.message;
        if (err.errors.licenseNumber)
          errores.licenseNumber = err.errors.licenseNumber.message;
      }
      res.render("../views/Physios/physio_add.njk", { errores });
    });
});

router.post("/:id", upload.single("image"), async (req, res) => {
  let newImagen = "";
  if (req.file) newImagen = req.file.filename;

  Physio.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        surname: req.body.surname,
        specialty: req.body.specialty,
        licenseNumber: req.body.licenseNumber,
        image: newImagen,
      },
    },
    { new: true, runValidators: true }
  )
    .then((result) => {
      res.redirect("/physios/" + result.id);
    })
    .catch((err) => {
      let errores = {
        general: "Error al editar el physio",
      };
      if (err.code === 11000) {
        if (err.keyPattern.licenseNumber) {
          errores.licenseNumber = "The number of insuarannce already exists";
        }
      } else {
        if (err.errors.name) errores.name = err.errors.name.message;
        if (err.errors.surname) errores.surname = err.errors.surname.message;
        if (err.errors.specialty)
          errores.specialty = err.errors.specialty.message;
        if (err.errors.licenseNumber)
          errores.licenseNumber = err.errors.licenseNumber.message;
      }
      res.render("../views/Physios/physio_edit.njk", {
        errores,
        physio: {
          id: req.body.id,
          name: req.body.name,
          surname: req.body.surname,
          specialty: req.body.specialty,
          image: req.body.image,
        },
      });
    });
});
// router.get("/", async (req, res) => {
//   Physio.find()
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Physio not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.get("/find", async (req, res) => {
//   let result;
//   const { specialty } = req.query;
//   try {
//     if (specialty) {
//       result = await Physio.find({
//         specialty: {
//           $regex: specialty,
//         },
//       });
//     } else {
//       result = await Physio.find();
//     }
//     res.status(200).send({ ok: true, resultado: result });
//   } catch (err) {
//     if (res.length === 0) {
//       res.status(404).send({ ok: false, error: "Physio not found" });
//     } else {
//       res.status(500).send({ ok: false, error: "Internal server error" });
//     }
//   }
// });

// router.get("/:id", async (req, res) => {
//   Physio.findById(req.params.id)
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Physio not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.post("/", async (req, res) => {
//   const { name, surname, specialty, licenseNumber } = req.body;
//   const newPhysio = new Physio({
//     name,
//     surname,
//     specialty,
//     licenseNumber,
//   });
//   console.log("newPhysio", newPhysio);
//   newPhysio
//     .save()
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       res.status(500).send({ ok: false, error: "Internal server error" });
//     });
// });

// router.put("/:id", async (req, res) => {
//   const { name, surname, specialty, licenseNumber } = req.body;
//   Physio.findByIdAndUpdate(
//     req.params.id,
//     {
//       name,
//       surname,
//       specialty,
//       licenseNumber,
//     },
//     { new: true }
//   )
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Physio not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.delete("/:id", async (req, res) => {
//   Physio.findByIdAndDelete(req.params.id)
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Physio not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

module.exports = router;
