const express = require("express");
const { protegerRuta, validarToken } = require("../auth/auth");
let router = express.Router();

const Record = require(__dirname + "/../models/record");
const Patient = require(__dirname + "/../models/patient");

router.get("/", protegerRuta(["admin", "physio"]), async (req, res) => {
  Record.find()
    .then((result) => {
      res.status(200).send({ ok: true, resultado: result });
    })
    .catch((err) => {
      if (res.length === 0) {
        res.status(404).send({ ok: false, error: "Record not found" });
      } else {
        res.status(500).send({ ok: false, error: "Internal server error" });
      }
    });
});

router.get(
  "/patient/:id/appointsments/dates",
  protegerRuta(["admin", "physio", "patient"]),
  async (req, res) => {
    let id = req.params.id;
    let patient = await Patient.findById(id);
    if (!patient) {
      res.status(404).send({
        ok: false,
        error: "No existe paciente con id " + req.params.id,
      });
    }
    Record.findOne({ patient: patient }).then((result) => {
      //   res.status(200).send({ ok: true, resultado: result });
      //   console.log(appointments);
      // let app = result.appointments.map(r);
      // console.log(app);
      // res.status(200).send({ ok: true, resultado: app });
      if (result.appointments) {
        res.status(200).send({ ok: true, result: result.appointments });
      } else {
        res.status(404).send({ ok: false, result: "No hay citas registradas" });
      }
    });
  }
);

router.get("/find", protegerRuta(["admin", "physio"]), async (req, res) => {
  let result;
  const { surname } = req.query;
  try {
    if (surname) {
      let patients = await Patient.find({ surname: { $regex: surname } });
      result = await Record.find({
        patient: { $in: patients.map((s) => s._id) },
      });
    } else {
      result = await Record.find();
    }
    res.status(200).send({ ok: true, resultado: result });
  } catch (err) {
    if (res.length === 0) {
      res.status(404).send({ ok: false, error: "Record not found" });
    } else {
      res.status(500).send({ ok: false, error: "Internal server error" });
    }
  }
});
router.get(
  "/:id",
  protegerRuta(["admin", "physio", "patient"]),
  async (req, res) => {
    let { id } = req.params.id;
    let user = req.user.login;
    let userRole = req.user.rol;

    if (userRole !== "admin" && userRole !== "physio") {
      let userID = await Patient.findOne({ name: user }).then((result) => {
        u = result._id.toString();
        return u;
      });
      if (userRole === "patient" && req.params.id !== userID) {
        return res.status(403).send({
          ok: false,
          error: "Only the patient can see his/her own data",
        });
      }
    }
    Record.findById(req.params.id)
      .then((result) => {
        res.status(200).send({ ok: true, resultado: result });
      })
      .catch((err) => {
        if (res.length === 0) {
          res.status(404).send({ ok: false, error: "Record not found" });
        } else {
          res.status(500).send({ ok: false, error: "Internal server error" });
        }
      });
  }
);

router.get(
  "/:id/appointments",
  protegerRuta(["admin", "physio"]),
  async (req, res) => {
    Record.findById(req.params.id)
      .populate("appointments")
      .then((result) => {
        console.log(result.appointments);
        res.status(200).send({ ok: true, resultado: result.appointments });
      })
      .catch((err) => {
        if (res.length === 0) {
          res.status(404).send({ ok: false, error: "Record not found" });
        } else {
          res.status(500).send({ ok: false, error: "Internal server error" });
        }
      });
  }
);

router.post("/", protegerRuta(["admin", "physio"]), async (req, res) => {
  const { patient, medicalRecord, appointments } = req.body;
  const newRecord = new Record({
    patient,
    medicalRecord,
    appointments,
  });
  newRecord
    .save()
    .then((result) => {
      res.status(200).send({ ok: true, resultado: result });
    })
    .catch((err) => {
      res.status(500).send({ ok: false, error: "Internal server error" });
    });
});

router.put("/:id", protegerRuta(["admin", "physio"]), async (req, res) => {
  const { date, patient, physio, treatment } = req.body;
  Record.findByIdAndUpdate(req.params.id, {
    date,
    patient,
    physio,
    treatment,
  })
    .then((result) => {
      res.status(200).send({ ok: true, resultado: result });
    })
    .catch((err) => {
      res.status(500).send({ ok: false, error: "Internal server error" });
    });
});

router.delete("/:id", protegerRuta(["admin", "physio"]), async (req, res) => {
  Record.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).send({ ok: true, resultado: result });
    })
    .catch((err) => {
      if (res.length === 0) {
        res.status(404).send({ ok: false, error: "Record not found" });
      } else {
        res.status(500).send({ ok: false, error: "Internal server error" });
      }
    });
});

module.exports = router;
