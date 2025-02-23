const express = require("express");
let router = express.Router();

const Record = require(__dirname + "/../models/record");
const Patient = require(__dirname + "/../models/patient");

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
  Record.findById(req.params.id)
    .populate("appointments")
    .then((result) => {
      res.render("../views/Records/record_add_appointment.njk", {
        records: result,
      });
    })
    .catch((err) => {
      res.render("error", { error: "Error mostrando appointments" });
    });
});

router.get("/:id", async (req, res) => {
  Record.findById(req.params.id)
    .populate("patient")
    .then((result) => {
      res.render("../views/Records/record_detail.njk", { record: result });
    })
    .catch((err) => {
      res.render("error", { error: "Error mostrando record" });
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
