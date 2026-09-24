const express = require('express');
const morgan = require('morgan');

const moviesRoutes = require('./routes/moviesRoutes');

const CustomError = require('./utils/customError')

const globalErrorHandler = require('./controllers/errorController')

let app = express();

app.use(express.static('./public'));  //Middleware to serve static files from public folder

//Lecture 34

app.use(express.json());  //Middleware to parse JSON data from request body
app.use(morgan('dev'));  //Middleware to log request details
//Custom middleware to log request details
const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
app.use(requestLogger);
app.use((req, res, next) => {
      req.requestTime = new Date().toISOString();
      next();
});

//USING ROUTES
app.use('/api/v1/movies', moviesRoutes);

//Default Route & it should always defined in the last
app.all('*path', (req, res, next)=> {
    // res.status(404).json({
    //     status: 404,
    //     message: `Can't find ${req.url} in the server`
    // })

    // const err = new Error(`Can't find ${req.url} in the server`);
    // err.status = 'Fail';
    // err.statusCode = 404;

    const err = new CustomError(404, `Can't find ${req.url} in the server`);

    next(err);  //When we pass any argument in next function express will assume that
    // an error has occured then it will skip all other middleware functions which we
    // have in middleware function stack & it will directly call this 
    // global error handling middleware function
});

//Global error handling middleware function
app.use(globalErrorHandler);

module.exports = app;