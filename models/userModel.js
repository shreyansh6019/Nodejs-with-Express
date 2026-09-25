const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [ true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [ validator.isEmail, "Please enter a valid email"]
    },
    role: {
        type: String,
        enum: [ "user", "admin" ],
        default: "user"
    },
    photo: String,
    password: {
        type: String,
        required: [ true, "Please enter a password"],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [ true, "Please confirm your password"],
        validate: {
            //only work for save & create
            validator: function(val){
                return val === this.password
            },
            message: "Password doesn't match"
        }
    },
    passwordChangedAt: Date
})

userSchema.pre('save', async function(){
    if(!this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);  //randomly add the string first then encrypt it because sometimes for two users password will be same so encrypted password will be same so it will add first then encrypt
    // this 12 is the cost which tell how much CPU intensive encryption can it be so higher the cost better the password
    this.confirmPassword = undefined;
})

userSchema.methods.comparePasswordInDB = async function(password, passwordDB) {
    return await bcrypt.compare(password, passwordDB)
}

userSchema.methods.isPasswordChanged = async function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const pswdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
        return JWTTimeStamp < pswdChangedTimeStamp ? true : false;
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;