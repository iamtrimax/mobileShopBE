const uploadProductPermission = require("../helper/permissionUploadProduct")
const productModel = require("../models/product")

const uploadProduct = async(req, res) => {
    try {
        const seassionUserId = req.userId
        console.log(seassionUserId);
        

        if(!uploadProductPermission(seassionUserId)) {
            throw new Error("Bạn không có quyền đăng bán sản phẩm")
        }
        const uploadProduct = new productModel(req.body)
        const saveProduct = await uploadProduct.save()

        res.json({
            data:saveProduct,
            message:"đã đăng bán sản phẩm",
            error: false,
            success: true
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
const updateProductController = async (req, res) => {
    try {

        if(!uploadProductPermission(req.userId)){
            throw new Error("bạn không có quyền sửa chi tiết sản phẩm")
        }

        const {_id, ...resBody} = req.body

        const updateProduct = await productModel.findByIdAndUpdate(_id, resBody)

        res.json({
            data: updateProduct,
            error: false,
            success: true,
            message: "update thông tin sản phẩm thành công"
        })
        
    } catch (error) {
        res.json({
            error: true,
            success: false,
            message: error.message || error,
        })
    }
}
const getProductController = async (req, res) => {
    try {
     const product = await productModel.find()
     res.json({
         data: product,
         message: "product",
         error:false,
         success: true
     })
    } catch (error) {
     res.json({
         message: error.message || error,
         error:true,
         success: false
     })
    }
 
 }
 const deleteProductController = async(req, res)=>{
    try {
        const {productId} = req.body
        
        const deleteProduct = await productModel.findByIdAndDelete(productId)
        res.json({
            data: deleteProduct,
            message: "xoá sản phẩm thành công",
            error: false,
            success: true
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error:true,
            success:false

        })
    }
}
const getDetailProduct= async (req, res) => {
   try {
    const productId = req.params.id

    const product = await productModel.findById(productId)

    console.log(product);
    

    res.json({
        data: product,
        error: false,
        success: true,
        message: "products"
    })
   } catch (error) {
    res.json({
        error:true,
        success:false,
        message: error.message || error
    })
   }
}
module.exports = {uploadProduct, getProductController, updateProductController, deleteProductController, getDetailProduct}