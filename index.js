//includes
const express = require('express');
const ejs = require('ejs');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const session = require('express-session');

//middlewares for layout
const { layoutMiddleWare } = require('./middlewares/layout')

//routes
const authRouter = require('./routes/auth')
const categoryRouter = require('./routes/category')
const coreRouter = require('./routes/core.js')
const courseRouter = require('./routes/course');
const userRouter = require('./routes/user')
const { getCoursesKind, getPagingInfo } = require('./controller/course');
const PORT = process.env.PORT || 5000;

//database connect
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("DB connected")
})
mongoose.connection.on('error', (error) => {
    console.log(`Database connection error: ${error}`)
})

//set view engine - ejs
app.set('view engine', 'ejs');
app.set('layout signup', false);
app.set('layout signin', false);


//middlewares
app.use(session({
    secret: 'SECRET_KEY',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true 
    }
}))
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(expressValidator());
app.use(layoutMiddleWare);
app.use(getPagingInfo);
app.set('trust proxy', 1) // trust first proxy




//routes
app.use('/auth', authRouter);
app.use('/', coreRouter);
app.use('/course', courseRouter);
app.use('/category', categoryRouter);
app.use('/user', userRouter)


//Start app
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})