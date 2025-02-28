const express = require("express");
let router = express.Router();

const Record = require(__dirname + "/../models/record");
const Patient = require(__dirname + "/../models/patient");
const Physio = require(__dirname + "/../models/physio");

router.get("/", async (req, res) => {
  Record.find()
    .populate("patient")
    .then((result) => {
      res.render("../views/Records/records_list.njk", { records: result });
    })
    .catch((err) => {
      res.render("error.njk", { error: "Error mostrando record" });
    });
});

router.get("/new", async (req,res)=>{
  let result;
  let patients = await Patient.find();
  result = await Record.find({
    patient: { $nin: patients.map((s) => s._id) },
  }).populate("patient");
  res.render("../views/Records/record_add.njk",{records:result})
})

router.get("/find", async (req, res) => {
    let result;
    const { surname } = req.query;
    try {
      if (surname) {
        let patients = await Patient.find({ surname: { $regex: surname } });
        result = await Record.find({
          patient: { $in: patients.map((s) => s._id) },
        }).populate("patient");
      } else {
        res.render("../views/error.njk",{error:"No se encontraron expedientes asociados al apellido ingresado."})
      }
      if(result.length){
        res.render("../views/Records/records_list.njk",{records:result})
      }else {
        res.render("../views/error.njk",{error:"No se encontraron expedientes asociados al apellido ingresado."})
      }
    } catch (err) {
      if (res.length === 0) {
        res.render("../views/error.njk",{error:"No se encontraron expedientes asociados al apellido ingresado."})
      } else {
        res.render("../views/error.njk",{error:"Hubo un problema al procesar la búsqueda. Inténtelo más tarde."})
      }
    }
  });

router.get("/edit/:id", async (req, res) => {
  Record.findById(req.params.id)
    .then((result) => {
      res.render("../views/Records/record_edit.njk", { record: result });
    })
    .catch((err) => {
      res.render("error.njk", { error: "Error mostrando record" });
    });
});

router.get("/:id/appointments", async (req, res) => {
  
  let physios = await Physio.find();
    

  Record.findById(req.params.id)
    .populate("appointments")
    .then((result) => {
      res.render("../views/Records/record_add_appointment.njk", {
        records: result,
        physios: physios,
      });
    })
    .catch((err) => {
      res.render("error", { error: "Error mostrando appointments" });
    });
});

router.get("/:id", async (req, res) => {
  Record.findById(req.params.id)
    .populate("appointments")
    .populate("patient")
    .then((result) => {
      res.render("../views/Records/record_detail.njk", { record: result });
    })
    .catch((err) => {
      res.render("error", { error: "Error mostrando record" });
    });
});

router.post("/", async (req, res) => {
  let appointments = []
  let insuranceNumber = req.body.insuranceNumber
  const patient = await Patient.findOne({insuranceNumber})
  let medicalRecord = req.body.medicalRecord
  if(!patient){
    let errores = {
      general : "Error al crear record",
      insuranceNumber:"No existe el insuranceNumber"
    };
    res.render("../views/Records/record_add.njk", {errores})

  }else{
    let id = patient._id
    const record = Record.findOne({id})

    if(record){
      let errores = {
        general : "Error al crear record",
        insuranceNumber:"Ya existe el record"
      };
      res.render("../views/Records/record_add.njk", {errores})
    }


    const newRecord = new Record({
    patient:patient._id,
    medicalRecord:medicalRecord,
    appointments:appointments,
    });
    newRecord
      .save()
      .then((result) => {
        res.redirect("/records")
      })
      .catch((err) => {
        let errores = {
          general : "Error al crear record"
        };
        if(err.errors.medicalRecord) errores.medicalRecord = err.errors.medicalRecord

        res.render("../views/Records/record_add.njk", {errores})
    });}
});

router.post("/:id/appointments", async (req, res) => {
  const { date, physio,diagnosis, treatment, observations } = req.body;

  let record = await Record.findById(req.params.id)
  let appointments = record.appointments
  appointments.push({date,physio,diagnosis,treatment,treatment,observations})




  Record.findByIdAndUpdate(req.params.id, {
    appointments:appointments
  })
    .then((result) => {
      res.send(result)
      if(result.length){
        res.redirect("/records")
      }else{
        res.render("../views/error.njk",{error:"No se inserto el expediente"})
      }
    })
    .catch( async (err) => {
      let errores = {
        general : "Error al crear record"
      };
      let physio = await Physio.find()
      // if(err.errors.date) errores.date = err.errors.date
      // if(err.errors.physio) errores.physio = err.errors.physio
      // if(err.errors.diagnosis) errores.diagnosis = err.errors.diagnosis
      // if(err.errors.treatment) errores.treatment = err.errors.treatment
      // if(err.errors.observations) errores.observations = err.errors.observations
      res.render("../views/Records/record_add_appointment.njk", {errores,physios:physio,records:{
        _id:req.params.id,
      }})
    });
});

router.delete("/:id", (req, res) => {
  Record.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.redirect("/records");
    })
    .catch((err) => {
      res.render("error", { error: "Error borrando record" });
    });
});

// router.get("/", async (req, res) => {
//   Record.find()
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Record not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.get("/", async (req, res) => {
//   Record.find()
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Record not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.get("/find", async (req, res) => {
//   let result;
//   const { surname } = req.query;
//   try {
//     if (surname) {
//       let patients = await Patient.find({ surname: { $regex: surname } });
//       result = await Record.find({
//         patient: { $in: patients.map((s) => s._id) },
//       });
//     } else {
//       result = await Record.find();
//     }
//     res.status(200).send({ ok: true, resultado: result });
//   } catch (err) {
//     if (res.length === 0) {
//       res.status(404).send({ ok: false, error: "Record not found" });
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
//   Record.findById(req.params.id)
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Record not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.get("/:id/appointments", async (req, res) => {
//   Record.findById(req.params.id)
//     .populate("appointments")
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result.appointments });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Record not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

// router.post("/", async (req, res) => {
//   const { patient, medicalRecord, appointments } = req.body;
//   const newRecord = new Record({
//     patient,
//     medicalRecord,
//     appointments,
//   });
//   newRecord
//     .save()
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       res.status(500).send({ ok: false, error: "Internal server error" });
//     });
// });

// router.put("/:id", async (req, res) => {
//   const { date, patient, physio, treatment } = req.body;
//   Record.findByIdAndUpdate(req.params.id, {
//     date,
//     patient,
//     physio,
//     treatment,
//   })
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       res.status(500).send({ ok: false, error: "Internal server error" });
//     });
// });

// router.delete("/:id", async (req, res) => {
//   Record.findByIdAndDelete(req.params.id)
//     .then((result) => {
//       res.status(200).send({ ok: true, resultado: result });
//     })
//     .catch((err) => {
//       if (res.length === 0) {
//         res.status(404).send({ ok: false, error: "Record not found" });
//       } else {
//         res.status(500).send({ ok: false, error: "Internal server error" });
//       }
//     });
// });

module.exports = router;
