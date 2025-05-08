const express = require("express");

const authToken = require("../midleware/authToken");
const { getUsersController, userLogoutController, userSignUpController, userSignInController, updateController, deleteUserController, userDetailsController, refreshTokenController, countAddtoCart, addToCart, getCart, updateCart, deleteCart } = require("../controller/user.controller");
const { getProductController, uploadProduct, deleteProductController, updateProductController, getDetailProduct } = require("../controller/product.controller");
const { createBannerController, deleteBannerController, getBannerController } = require("../controller/banner.controller");
const { uploadComment, getComments } = require("../controller/comments.controller");

const router = express.Router();

//get api
router.get("/user-details", authToken, userDetailsController)
router.get("/product-detail/:id", getDetailProduct)
router.get('/get-users' ,authToken, getUsersController);
router.get('/get-products', getProductController)
router.get("/get-banner", getBannerController)
router.get("/logout", userLogoutController)
router.get("/get-comments/:productId",getComments)
router.get("/count-carts", authToken, countAddtoCart);
router.get("/get-carts", authToken, getCart)
//post api
router.post("/signup", userSignUpController);
router.post("/login", userSignInController);
router.post("/update-user", updateController);
router.post("/delete-user", deleteUserController);
router.post("/upload-product",authToken,uploadProduct);
router.post("/delete-product", authToken, deleteProductController);
router.post("/update-product", authToken,updateProductController)
router.post("/create-banner", authToken, createBannerController)
router.post("/delete-banner", authToken, deleteBannerController)
router.post("/upload-comment", authToken, uploadComment)
router.post("/add-to-cart", authToken,addToCart)
router.post("/update-cart", authToken,updateCart)
router.post("/delete-cart", authToken,deleteCart)

router.post("/refresh-token", refreshTokenController)



module.exports = router;
