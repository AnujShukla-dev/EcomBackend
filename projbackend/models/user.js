const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');


const userSchema = new mongoose.Schema({
name:{
    type: String,
    required: true,
    maxlength:32,
    trim: true
   },
lastName:{
    type: String,
    maxlength:32,
    trim: true
    },
    email:{
        type:String ,
        trim: true,
        unique:true
    },
    encry_password:{
        type:String ,
        required :true
    },
    userinfo:{
        type:String,
        trim : true,
    },
    salt:String,
    role:{
        type : Number,
        default: 0
    },
    purchases :{
        typr:Array,
        default: []
    }  
},
{timestamps:true});
userSchema.virtual("password")
    .set(function(password){
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password
    });

userSchema.method ={
    securePassword: function(plainpassword){
        if(!password) return "";
        try{
            return crypto
                .createHmac('sha256',this.salt)
                .update(plainpassword)
                .digest("hex");
        }
        catch(err){
            return ""; 
        }
    },
    authenticate : function(plainPassword){
        return this.securePassword(plainpassword) === this.encry_password; 
    }
}
module.exports = mongoose.model("User",userSchema)