const express = require('express');
const { json, urlencoded } = require('body-parser');
const mongoose = require('mongoose');

const planetRoutes = require('./app/routes/planet.routes');
const dbConfig = require('./config/database.config');

// connect to the database
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

mongoose
    .connect(dbConfig.url, { useNewUrlParser: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch((err) => {
        console.log('Could not connect to the database. Exiting now...', err);

        return process.exit(1);
    });

// routes definition
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(json());

planetRoutes(app);
// app.get('/', (req, res) => res.json({ 'message': 'Welcome to Star Wars Planets REST API' }));

// listen for requests
const serverPort = 3000;

app.listen(serverPort, () => console.log( `Server is listening on port ${serverPort}`));

