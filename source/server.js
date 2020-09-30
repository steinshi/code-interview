const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json();

const providers = require('./providers_search.js');
const appointment = require('./appointment.js');

app.use(bodyParser.json());

app.get('/appointments', function (req, res) {
  let params = req.query;
  if (!params.hasOwnProperty("specialty") || params.specialty =="") {
    return res.status(400).send("no specialty");
  }
  if (!params.hasOwnProperty("date") || isNaN(params.date)) {
    return res.status(400).send("no date");
  }
  if (!params.hasOwnProperty("minScore") || params.minScore < 0) {
    return res.status(400).send("no minScore");
  }
  res.send(providers.searchProviders(params.specialty, params.date, params.minScore));
});
 
 app.post('/appointments', function (req, res) {
  let params = req.body;
  if (!params.hasOwnProperty("name") || params.name =="") {
    return res.status(400).send("no name");
  }
  if (!params.hasOwnProperty("date") || isNaN(params.date)) {
    return res.status(400).send("no date");
  }
  let set_appointment = appointment.setAppointment(params.name, params.date);
  if (set_appointment) {
    return res.send("appointment set");
  }
  res.status(400).send();
  
});


app.listen(3500);

