const CustomError = require('../utils/customError')

const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
};

const prodErrors = (res, error) => {
    if(error?.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else {
        res.status(500).json({
            status: 'Error',
            message: "Something went wrong! Please try again later."
        });
    }
};

const castErrorHandler = (error) => {
    const msg = `Invalid value for ${error.path}: ${error.value}`
    return new CustomError(400, msg)
}

const duplicateKeyErrorHandler = (error) => {
    const msg = `There is already a name ${error.keyValue.name}. Please use another name!`
    return new CustomError(400, msg)
}

const validationErrorHandler = (error) => {
    const errors = Object.values(error.errors).map(val=>val.message);
    const errorMessages = errors.join(". ");
    const msg = `Invalid input data: ${errorMessages}`
    return new CustomError(400, msg);
}

const tokenExpiredHandler = (error) => {
    return new CustomError(401, "JWT Yoken has expired! Please login again.")
}

const jsonWebTokenHandler = (error) => {
    return new CustomError(401, "Invalid token. Please login again")
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Error';
    
    console.log("Error occurs: ", error)
    if(process.env.NODE_ENV === "development") {
        devErrors(res, error);
    }
    if(process.env.NODE_ENV === "production") {
        // let errorObj = {...error, name: error.name}
        if(error.name === "CastError") error = castErrorHandler(error);
        if(error.code === 11000) error = duplicateKeyErrorHandler(error);
        if(error.name === 'ValidationError') error=validationErrorHandler(error);
        if(error.name === "TokenExpiredError") error=tokenExpiredHandler(error);
        if(error.name === "JsonWebTokenError") error=jsonWebTokenHandler(error);
        prodErrors(res, error);
    }
}