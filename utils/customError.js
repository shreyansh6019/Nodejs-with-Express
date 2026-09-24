class CustomError extends Error {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >=400 && statusCode < 500 ? "Failed" : "Server Error";  

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor); //where the error has actually happened int the code
    }
}

//All the errors through this class will be operational errors

module.exports = CustomError;