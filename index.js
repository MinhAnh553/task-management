const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const database = require('./config/database');
const APIs_V1 = require('./api/v1/routes/indexRoute');
require('dotenv').config();

// App, port
const app = express();
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json());

// cookie
app.use(cookieParser());

// cors
app.use(cors());

// Database
database.connect();

// Route
app.use('/api/v1', APIs_V1);

app.listen(port, () => {
    console.log(`Project back-end running at http://localhost:${port}...`);
});
