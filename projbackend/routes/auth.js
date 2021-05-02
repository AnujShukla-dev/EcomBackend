var  express = require("express");
var router =  express.Router()
const signout  = require('../controllers/auth.js')


router.get("/signout",signout );
module.exports = router;