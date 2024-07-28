const express = require('express');
const bodyParser = require('body-parser');

const database = require('./config/database');
const APIs_V1 = require('./api/v1/routes/indexRoute');
require('dotenv').config();

// App, port
const app = express();
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json());

// Database
database.connect();

// Route
app.use('/api/v1', APIs_V1);

app.listen(port, () => {
    console.log(`Project back-end running at http://localhost:${port}...`);
});
