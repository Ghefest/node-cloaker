'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const DetectService = require('./detect.service.js');

const express = require('express');

const app = express();
const port = 3000;

console.log(DetectService.redirectFlow);

app.use(DetectService.redirectFlow);
app.use('/white', express.static(path.join(__dirname, 'white')));
app.use('/black', express.static(path.join(__dirname, 'black')));

app.listen(3000, () => console.log('Server running on port ' + port));
