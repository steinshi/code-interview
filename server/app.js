const express = require("express");
const app = express();
const config = require("./config");
const appointmentsService = require("./services/appointments");
var bodyParser = require("body-parser");

const PORT = config.REST_PORT;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app
  .route("/appointments")
  .get(function (req, res) {
    const { specialty, date, minScore } = req.query;
    let { code, providers } = appointmentsService.getAppointment(
      specialty,
      date,
      minScore
    );
    res.status(code).send(providers);
  })
  .post(function (req, res) {
    const { name, date } = req.body;
    let code = appointmentsService.setAppointment(name, date);
    res.status(code).send();
  });

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
