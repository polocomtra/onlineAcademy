//includes
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')

//routes
const userRouter = require('./routes/auth')
const PORT = process.env.PORT || 5000;

//database connect
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connected")
})
mongoose.connection.on('error', (error) => {
    console.log(`Database connection error: ${error}`)
})

//set view engine - ejs
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

//routes
app.use('/', userRouter);




//Start app
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})