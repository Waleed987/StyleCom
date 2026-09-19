const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'Testkey';

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    isAdmin:{
        type:Boolean
    },
    googleId:{
        type:String,
        sparse:true
    }
});

UserSchema.methods.generateToken = function(){
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email ,
            isAdmin: this.isAdmin    
        },
        getJwtSecret(),
        {
            expiresIn:"2h",
        }
    )
    } catch (error) {
        console.log(error);
        return null;
    }
}

const User = new mongoose.model("User", UserSchema);

module.exports = User;
