const express = require("express");
const fs = require("fs");
const router = express.Router();

router.post('/schools', (req, res) => {
  const schools = readSchools();
  const maxId = schools.length > 0 ? Math.max(...schools.map(s => s.id)) : 0;
  const newSchool = { id: maxId + 1, ...req.body };
  schools.push(newSchool);
  writeSchools(schools);
  res.status(201).json(newSchool);
});

router.put("/schools/:id", (req, res) => {
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

router.delete("/schools/:id", (req, res) => {
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

// Hae koulu ID:n perusteella
router.get("/schools/:id", (req, res) => {
  const schools = readSchools();
  const school = schools.find((s) => s.id == req.params.id);
  
  if (school) {
    res.json(school);
  } else {
    res.status(404).json({ error: "Koulua ei löytynyt" });
  }
});

module.exports = router;