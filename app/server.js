const express = require("express");
const bodyParser = require("body-parser");

const providersRouter = require("./routes/providersRouter");

const app = express();

app.use(bodyParser.json());
app.use(providersRouter);

app.listen(3500);
