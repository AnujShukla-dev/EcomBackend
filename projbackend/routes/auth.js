var  express = require("express");
var router =  express.Router()
const {check,validationResult} = require('express-validator')
const {signout,signup,signin,isSignedIn}  = require('../controllers/auth.js')

//sign up route
router.post('/signup',[
    check("name","name should be atleast 3 character").isLength({min:3}),
    check("email","email is required").isEmail(),
    check("password","password should be atleast 3 char ").isLength({min:3}),
],signup);

//sugn in route
router.post('/signin',[
    check("email","email is required").isEmail(),
    check("password","password is required ").isLength({min:1}),
],signin);

//signout route
router.get("/signout",signout );

router.get('/testroute',isSignedIn,(req,res)=>{
    res.send("A protected route");
})
module.exports = router;