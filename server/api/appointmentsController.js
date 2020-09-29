// appointments.js - appointments route module.

var express = require("express");
var router = express.Router();

router.get("/appointments", function (req, res) {
  // res.send("Wiki home page");
  console.log(req.body);
  console.log("req.body");
});

router.post("/appointments", function (req, res) {
  // res.send("Wiki home page");
  console.log(req.params);
});

module.exports = router;
