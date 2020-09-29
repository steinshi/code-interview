const express = require("express");
// const appointmentsController = require("./api/appointmentsController.js");
const app = express();
const config = require("./config");
const dbq = require("./models/providersModel");

const PORT = config.REST_PORT;

app
  .route("/appointments")
  .get(function (req, res) {
    let a = dbq.getAppointment(
      req.query.specialty,
      q.query.date,
      q.query.minScore
    );
    console.log(req.query);
  })
  .post(function (req, res) {
    console.log("POST " + req.query);
  });

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
