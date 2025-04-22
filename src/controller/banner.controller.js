const Banner = require("../models/Banner")
const Permission = require("../helper/permissionUploadProduct")

const getBannerController = async(req, res) =>{
    try {
        const banner = await Banner.find().populate("productId")

    res.json({
        data: banner,
        error:false,
        success:true,
        message:"banner...."
    })
    } catch (error) {
      res.json({
        error:true,
        success:false,
        mesage: error.message || error
      })  
    }
}
const createBannerController = async (req, res) => {
    try {
        const curentUser = req.userId
        if(!Permission(curentUser)){
            throw new Error("bạn không có quyền này")
        }
        const Banner = new BannerModle(req.body);
        const saveBaner = Banner.save()

        res.json({
            data: saveBaner,
            error:false,
            success: true,
            message:"thêm banner thành công"
        })
    } catch (error) {
        res.json({
            error:true,
            success: false,
            message: error.message || error
        })
        console.log(error);
        
    }
}
const deleteBannerController = async(req, res) => {
    try {
        if(!permission(req.userId)){
            throw new Error("bạn không có quyền này")
        }
        const {bannerId} = req.body
        console.log(bannerId);
        
        const deleteBanner = await Banner.findByIdAndDelete(bannerId)      
        res.json({
            data: deleteBanner,
            message:"đã xoá banner",
            success:true,
            error:false
        })
    } catch (error) {
        res.json({
            message:error.message || error,
            success:false,
            error:true
        })
    }
}
module.exports = {getBannerController, createBannerController, deleteBannerController}