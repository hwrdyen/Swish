const express = require("express");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
