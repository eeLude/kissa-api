const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Tuo reitit
app.use(require("./routes/schools"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});