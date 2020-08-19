const express = require("express");

const endpointUrl = require("./endpointUrl");
const providersCntr = require("../controllers/providersCntr");

const router = express.Router();

router.get(endpointUrl.appointments, providersCntr.getAppointments);
router.post(endpointUrl.appointments, providersCntr.setAppointments);

module.exports = router;
