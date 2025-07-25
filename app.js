const express = require('express');
const app = express();

app.use(express.json()); 
const route = require('./routes');  
route(app);   

module.exports = app;
