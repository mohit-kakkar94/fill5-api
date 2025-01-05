const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const wordRouter = require("./routes/wordRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(cors());

app.use("/api/v1/word", wordRouter);

app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

module.exports = app;
