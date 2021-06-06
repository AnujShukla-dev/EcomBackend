const user = require("../models/user");
const User  = require ("../models/user");
const Order = require("../models/order");
const product = require("../models/product");

exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
            if(err || !user){
                return res.status(400).json({
                    error: "No user was found in db"
                })
            }
            req.profile = user;
            next();
    });
}

exports.getUser = (req,res)=>{
    // TODO get  back here for password
    req.profile.salt = undefined,
    req.profile.encry_password =undefined
    return res.json(req.profile)
}

/*exports.getAllUser = (req,res)=>{
    User.find().exec((err,users)=>{
        if(err || !users){
            console.log(err);
            return res.status(400).json({
                error:"NO User Found"
            })
        }
        return res.send(users);
    })
}*/

exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        { new:true,useFindAndModify:false},
        (err,user)=>{
           if(err){
            return res.status(400).json({
                error:"Upate in databse was not successfull"
            })
           }
            user.salt = undefined,
            user.encry_password =undefined
            return res.json(req.profile)
        }
    )
}
exports.userPurchaseList =(req,res)=>{
    Order.find({user:req.profile._id}).populate("user","_id name").exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No Order in this account"
            })
        }
        return  res.json(order);
    })
}
exports.putOrderInPurchaseList= (req,res,next)=>{
    let purchases = req.body.order.products.forEach(products=>{
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.ammount,
            transaction_id :req.body.transction_id
        })
    })

//store in db

User.findByIdAndUpdate(
    {_id: req.profile._id},
    {$push:{purchases:purchases}},
    {new:true},
    (err,purchases)=>{
        if(err){
            return res.status(400).json({
                errro:"Unable to save purchse list"
            })
        }
        next()
    }
    )



    
}