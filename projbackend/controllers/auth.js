require("dotenv").config();
const {check,validationResult} = require('express-validator')
const User = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//signup 
exports.signup = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }
 const user = new User(req.body)
 user.save((err,user) =>{
     if(err){
         console.log(err);
         return res.status(400).json({
             err:"Not able to save user in db"
         })
          
     }
     return res.json({
         name : user.name,
         email:user.email,
         id:user._id
     });
 })
};


//Sign in
exports.signin = (req,res)=>{
    const {email,password} = req.body;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }
    User.findOne({email},(err,user)=>{
        if(err || !user){
            res.status(400).json({
                error:"User email does not exist"
            })
        }
        if(!user.authenticate(password)){
                 return res.status(401).json({
                error:"email and password do not match "
            })
        }
        //create token 
        const token  = jwt.sign({_id:user._id},process.env.SECRET)
        
        //put token in cookie 
        res.cookie("token",token,{
            expire:new Date() + 9999
        })

        //send response to frontend 
        const {_id,name,email,role} = user;
        return res.json({
            token,user:{
                _id,
                name,
                email,
                role
            }
        })
    })
    
}



//signout 
exports.signout  =  (req,res)=>{
    res.clearCookie("token");
    res.json({
        'message':"user logged out"
    });
};

//prodtected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})


//cutom middlewares 
exports.isAuthenticated = (req,res,next)=>{
    console.log(req.profile);
let checker  = req.profile && req.auth   && req.profile._id == req.auth._id;
if(!checker){
    return res.status(403).json({
        error : "ACCESS DENIED"    
        });
    }
    next();
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0){
        return  res.status(403).json({
            error : "You are not admin access denied"    
            });
    }
    next();
}





