const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
 

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).populate("category ");
  exec((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Product not Found",
      });
    }
    req.product = product;
    next();
  });
};


exports.getProduct = (req, res) => {
  req.product.photo = undefined
  return res.json(req.product);
};


//middleware
exports.photo=(req,res,next)=>{
  if(req.product.photo.data){
    res.set("Content-Type",req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}


exports.createProduct = (req, res) => {
  
  let form = new formidable.IncomingForm();
 
  
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
       console.log(fields);
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //destructure the fields
    const { price, name, description, category, stock } = fields;
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        error: "Please include all fields ",
      });
    }

    let product = new Product(fields);

    //handle the file
    if (file.photo) {
      if (file.photo.size > 3145728) {
        return res.status(400).json({
          error: "file size to big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to db
    product.save((err, product) => {
        console.log(err);
      if (err) {
        return res.status(400).json({
          error: "Unable to C  reate Product ",
        });
      }
      return res.json( product);
    });
  });
};

exports.deleteProduct= (req,res)=>{
  let product = req.product;
  product.remove((err,deletedProduct)=>{
    if(err){
      return res.status(400).json({
        error : "Failed to delete the product "
      })
      res.json({
        message:"Deleted Product",deletedProduct
      });
    }
  })
}

exports.updateProduct = (req,res)=>{
    
  let form = new formidable.IncomingForm();
   
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
       console.log(fields);
    if (err) {
      return res.status(400).json({
        error: "problem with image",
      });
    }

    //destructure the fields
    const { price, name, description, category, stock } = fields;
   
//updation code 
    let product = req.product;
    product = _.extend(product,fields)

    //handle the file
    if (file.photo) {
      if (file.photo.size > 3145728) {
        return res.status(400).json({
          error: "file size to big!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to db
    product.save((err, product) => {
        console.log(err);
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed  ",
        });
      }
      return res.json( product);
    });
  });
}
exports.getAllProducts = (req,res)=>{
  let limit  =req.query.limit?parseInt(req.query.limit):8;
  let sortBy = req.query.sortBy? req.query.sortBy:"_id";
  Product.find()
  .select("-photo")
  .populate("category")
  .limit(limit)
  .sort([[sortBy,"asc"]])
  .exec((err,products)=>{
    if(err){
      return res.status(400).json({
        error:"No Product Found"
      })
         }
         res.json(products);
  })
}

exports.updateStock = (req,res,next)=>{
  let myOperation = req.body.order.products.map(prod =>{
    return {
      updateOne:{
          filter:{_id:prod._id},
          update:{$inc:{stock: -prod.count,sold:+prod.count}}
      }
    }
  })
  Product.bulkWrite(myOperation,{},(err,products)=>{
    if(err){
      return res.status(400).json({
        error: "Bulk opertion failed"
      })
    }
    next();
  })
}

exports.getAllUniqueCategories= (req,res)=>{
  Product.distinct("category",{},(err,category)=>{
    if(err){
      return res.satatus(400).json({
        error:"No Category found"
      });
      return res.json(category);
    }
  })
}