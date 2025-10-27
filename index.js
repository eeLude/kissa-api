const express = require('express');
const app = express();
const PORT = 3000;
const fs = require("fs");

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function readSchools() {
  const data = fs.readFileSync("./data.json", "utf8");
  return JSON.parse(data);
}

// Hae kaikki koulut
app.get("/schools", (req, res) => {
  const schools = readSchools();
  res.json(schools);
});

// Hae koulu ID:n perusteella
app.get("/schools/:id", (req, res) => {
  const schools = readSchools();
  const school = schools.find((s) => s.id == req.params.id);
  
  if (school) {
    res.json(school);
  } else {
    res.status(404).json({ error: "Koulua ei löytynyt" });
  }
});

function writeSchools(schools) {
  fs.writeFileSync("./data.json", JSON.stringify(schools, null, 2));
}

app.post('/schools', (req, res) => {
  const schools = readSchools();
  const maxId = schools.length > 0 ? Math.max(...schools.map(s => s.id)) : 0;
  const newSchool = { id: maxId + 1, ...req.body };
  schools.push(newSchool);
  writeSchools(schools);
  res.status(201).json(newSchool);
});

app.put("/schools/:id", (req, res) => {
  const schools = readSchools();
  const school = schools.find(s => s.id == req.params.id);
  
  if (school) {
    school.departments.push(req.body.department);
    writeSchools(schools);
    res.json(school);
  } else {
    res.status(404).json({ error: "Koulua ei löytynyt" });
  }
});

app.delete("/schools/:id", (req, res) => {
  const schools = readSchools();
  const schoolIndex = schools.findIndex((s) => s.id == req.params.id);

  if (schoolIndex !== -1) {
    schools.splice(schoolIndex, 1);
    writeSchools(schools);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Koulua ei löytynyt" });
  }
});