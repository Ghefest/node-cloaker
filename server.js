'use strict';

require('dotenv').config();
const PORT = process.env.PORT;

const fs = require('fs');
const path = require('path');

const DetectService = require('./detect.service.js');
const CountersService = require('./counters.service.js');

const express = require('express');

const app = express();
const useragent = require('express-useragent');

app.use(useragent.express());
app.use((req, res, next) => new DetectService().redirectFlow(req, res, next));
app.use((req, res, next) => new CountersService().countFlow(req, res, next));
app.use('/white', express.static(path.join(__dirname, 'white')));
app.use('/black', express.static(path.join(__dirname, 'black')));

app.listen(+PORT, () => console.log('Server running on port ' + PORT));
