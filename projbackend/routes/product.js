var express = require("express");
const router = express.Router();

const {isAdmin,isSignedIn,isAuthenticated} = require("../controllers/auth");
const  {getProduct,getProductById,createProduct,photo,updateProduct,deleteProduct,getAllProducts,getAllUniqueCategories} = require("../controllers/product");
const {getUserById} = require("../controllers/user")

//parms
router.param("productId",getProductById);
router.param("userId",getUserById);

//actual routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct)


//read route
router.get("product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

//update route
router.put("/product/update/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)

//delete route
router.delete("/product/delete/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)

//listing route
router.get("/products",getAllProducts)


router.get("/products/categories",getAllUniqueCategories)

module.exports = router;