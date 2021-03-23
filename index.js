const bp = require('body-parser');
const express = require('express');
const cors = require('cors');

const Config = require('@est/config');
const Log = require('@est/bin/log');

const log = new Log();

// ===============
//  LOAD MODELS
// ===============
log.info("Loading models");
const Test = require('@est/src/models/test').instance(Config.db.url, Config.db.name);

// ===============
//  APP SETUP
// ===============
const app = express();

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({
  extended: false
}));

// ===============
//  ENDPOINTS
// ===============
log.data("Defining endpoints");
app.get('/api', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/api/test', Test.get);

// ===============
//  STATIC
// ===============
log.data("Loading static assets");
app.use(express.static('static'));
app.get('/');

// ===============
//  APP RUN
// ===============
app.listen(Config.app.port);
log.info('Controller running on port', Config.app.port);
