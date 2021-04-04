const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');
const bodyParser = require('body-parser');

// Passing an book param to the bookRouter function
const bookRouter = require('./routes/bookRouter')(Book);

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', (_req, response) => {
    response.send('Welcome to my Nodemon API!');
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
