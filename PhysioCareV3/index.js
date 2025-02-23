const mongoose = require("mongoose");
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");
const Patient = require("./models/patient");
const Physio = require("./models/physio");
const Record = require("./models/record");
const User = require("./models/users");
const express = require("express");
const dotenv = require("dotenv");
const Patient2 = require("./routes/patient");
const Physio2 = require("./routes/physios");
const Record2 = require("./routes/records");

let app = express();
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/patients", Patient2);
app.use("/physios", Physio2);
app.use("/records", Record2);
dotenv.config();
app.listen(process.env.PORT);
app.get("/", (req, res) => {
  res.redirect("/public/index.html");
});
// Function to load initial data
async function loadData() {
  try {
    // Clean existing collections
    await Patient.deleteMany({});
    await Physio.deleteMany({});
    await Record.deleteMany({});
    await User.deleteMany({});

    // Create some patients
    const patients = [
      new Patient({
        name: "José",
        surname: "López",
        birthDate: new Date("1985-06-15"),
        address: "Calle Mayor 123, Alicante",
        insuranceNumber: "123456789",
      }),
      new Patient({
        name: "Ana",
        surname: "Pérez",
        birthDate: new Date("1990-09-22"),
        address: "Avenida del Sol 45, Valencia",
        insuranceNumber: "987654321",
      }),
      new Patient({
        name: "Luis",
        surname: "Martínez",
        birthDate: new Date("1975-03-11"),
        address: "Calle de la Luna 89, Alicante",
        insuranceNumber: "456789123",
      }),
      new Patient({
        name: "María",
        surname: "Sanz",
        birthDate: new Date("1992-05-30"),
        address: "Plaza Mayor 22, Valencia",
        insuranceNumber: "321654987",
      }),
    ];

    // Save all patients using Promise.all
    const savedPatients = await Promise.all(
      patients.map((patient) => patient.save())
    );
    console.log("Added patients:", savedPatients);

    // Create several physios, at least one for each specialty
    const physios = [
      new Physio({
        name: "Javier",
        surname: "Martínez",
        specialty: "Sports",
        licenseNumber: "A1234567",
      }),
      new Physio({
        name: "Ainhoa",
        surname: "Fernández",
        specialty: "Neurological",
        licenseNumber: "B7654321",
      }),
      new Physio({
        name: "Mario",
        surname: "Sánchez",
        specialty: "Pediatric",
        licenseNumber: "C9876543",
      }),
      new Physio({
        name: "Andrea",
        surname: "Ortega",
        specialty: "Pediatric",
        licenseNumber: "D8796342",
      }),
      new Physio({
        name: "Ana",
        surname: "Rodríguez",
        specialty: "Geriatric",
        licenseNumber: "E6543210",
      }),
      new Physio({
        name: "Marcos",
        surname: "Gómez",
        specialty: "Oncological",
        licenseNumber: "F4321098",
      }),
    ];

    // Save all physios using Promise.all
    const savedPhysios = await Promise.all(
      physios.map((physio) => physio.save())
    );
    console.log("Added physios:", savedPhysios);

    // Create records with appointments
    const records = [
      new Record({
        patient: savedPatients[0]._id,
        medicalRecord:
          "Paciente con antecedentes de lesiones en rodilla y cadera.",
        appointments: [
          {
            date: new Date("2024-02-10"),
            physio: savedPhysios[0]._id, // Sports specialty physio
            diagnosis: "Distensión de ligamentos de la rodilla",
            treatment: "Rehabilitación con ejercicios de fortalecimiento",
            observations:
              "Se recomienda evitar actividad intensa por 6 semanas",
          },
          {
            date: new Date("2024-03-01"),
            physio: savedPhysios[0]._id,
            diagnosis: "Mejoría notable, sin dolor agudo",
            treatment: "Continuar con ejercicios, añadir movilidad funcional",
            observations: "Próxima revisión en un mes",
          },
        ],
      }),
      new Record({
        patient: savedPatients[1]._id,
        medicalRecord: "Paciente con problemas neuromusculares.",
        appointments: [
          {
            date: new Date("2024-02-15"),
            physio: savedPhysios[1]._id, // Neurological specialty physio
            diagnosis: "Debilidad muscular en miembros inferiores",
            treatment: "Terapia neuromuscular y estiramientos",
            observations: "Revisar la evolución en 3 semanas",
          },
        ],
      }),
      new Record({
        patient: savedPatients[2]._id,
        medicalRecord: "Lesión de hombro recurrente, movilidad limitada.",
        appointments: [
          {
            date: new Date("2024-01-25"),
            physio: savedPhysios[2]._id, // Pediatric specialty physio
            diagnosis: "Tendinitis en el manguito rotador",
            treatment: "Ejercicios de movilidad y fortalecimiento",
            observations: "Revisar en 4 semanas",
          },
        ],
      }),
      new Record({
        patient: savedPatients[3]._id,
        medicalRecord: "Paciente con problemas oncológicos.",
        appointments: [
          {
            date: new Date("2024-01-15"),
            physio: savedPhysios[4]._id, // Oncology specialty physio
            diagnosis: "Fatiga post-tratamiento oncológico",
            treatment: "Ejercicios suaves y terapia de relajación",
            observations: "Revisión en 2 semanas",
          },
        ],
      }),
    ];
    //save users {{"usuario":"hector2","password":"1234","rol":"admin"}}
    const users = [
      new User({
        login: "hector2",
        password: "1234",
        rol: "admin",
      }),
      new User({
        login: "hector3",
        password: "1234",
        rol: "physio",
      }),
      new User({
        login: "hector4",
        password: "1234",
        rol: "patient",
      }),
    ];
    const savedUsers = await Promise.all(users.map((user) => user.save()));
    console.log("Added users:", savedUsers);
    // Save all files using Promise.all
    const savedRecords = await Promise.all(
      records.map((record) => record.save())
    );
    console.log("Added records:", savedRecords);

    // mongoose.disconnect();
    console.log("Data successfully loaded and disconnected from MongoDB");
  } catch (error) {
    console.error("Error loading data:", error);
    mongoose.disconnect();
  }
}

// Connect to MongoDB database
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Successful connection to MongoDB");
    // loadData();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
