El ejercicio está hecho para que no se pueda repetir nombre para el usuario y los pacientes, physio.
He hecho un script de test cada uno separado por su tipo patientTest.js, physiosTest.js y recordsTest.js
En el package.json te he dejado los comandos que tienes que hacer, te los dejo aquí abajo para que te sea
más rápido pasar los test.
"patient": "node tests/patientTest.js",
"physio": "node tests/physiosTest.js",
"record": "node tests/recordsTest.js"
npm run patient
npm run physio
npm run record