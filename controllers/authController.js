const User = require('../models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const util = require('util')

const signToken = id => {
    return jwt.sign(
    {
        id
    },
    process.env.SECRET_KEY,
    {
        expiresIn: process.env.LOGIN_EXPIRES
    }  
   )
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
   const newUser = await User.create(req.body); 
   const token = signToken(newUser._id);
   res.status(201).json({
        status: 'success',
        token, 
        data: {
            user: newUser
        }
    });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(1,req.body);
    if(!email || !password) {
        const error = new CustomError(400, "Please provide email & password");
        return next(error);
    }
    const user = await User.findOne({ email });
    // const isPasswordMatch = await user.comparePasswordInDB(password, user.password);
    if(!user || !(await user.comparePasswordInDB(password, user.password))){
        const error = new CustomError(400, "Incorrect email or password");
        return next(error);
    }
    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        token, 
        user: {
            name: user.name,
            email: user.email
        }
    });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
    //1. Read the token & check if it exist
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith("Bearer")){
        token = testToken.split(" ")[1];
    }
    if(!token){
        return next(new CustomError(401, "You're not logged in!"));
    }

    //2. validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY);

    //3. If the user exist
    const user = await User.findById(decodedToken.id);
    if(!user){
        return next(new CustomError(400, "User does not exist. Please sign up again"));
    }

    //4. If the user has changesd the password fter the token has issued
    const isPswdChanged = await user.isPasswordChanged(decodedToken.iat);
    if(isPswdChanged){
        return next(new CustomError(401, "Password has been changed recently. Please login again"));
    }

    //5. Allow user to access the route
    req.user=user;
    next();
})

exports.restrict = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            return next(new CustomError(403, "You do not have the permission to perform this action"))
        }
        next();
    }
}

//For multiple roles to perform given action
exports.restrictForMultipleRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new CustomError(403, "You do not have the permission to perform this action"))
        }
        next();
    }
}