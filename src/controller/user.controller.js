const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const carts = require("../models/cart");
const productModel = require("../models/product");
const { success, error } = require("toastr");
const userLogoutController = async (req, res) => {
  try {
    res.clearCookie("refreshToken");

    res.json({
      message: "đã đăng xuất",
      data: [],
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
const userSignInController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error("Email không được để trống");
    if (!password) throw new Error("mật khẩu không được để trống");

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("User không tồn tại");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
        userName: user.username,
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "30s",
      });
      const refreshToken = await jwt.sign(
        tokenData,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Bật khi dùng HTTPS
        sameSite: "Strict",
        path: "/", // chỉ gửi cookie khi gọi đúng API này
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });
      res.status(200).json({
        message: "Đăng nhập thành công",
        data: token,
        error: false,
        success: true,
      });
    } else {
      throw new Error("Kiểm tra mật khẩu");
    }
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
const refreshTokenController = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new Error("Không có refresh token");
      next();
    }

    const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);

    const newAccessToken = jwt.sign(
      {
        _id: userData._id,
        email: userData.email,
        userName: userData.userName,
      },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("err>>>>", error);

    return res.status(401).json({
      message: error.message || error,
      error: true,
    });
  }
};
const userSignUpController = async (req, res) => {
  try {
    const { username, email, password, rePassword } = req.body;

    const user = await userModel.findOne({ email });

    if (user) throw new Error("User đã tồn tại");
    if (!email) throw new Error("email không được để trống");
    if (!username) throw new Error("tên không được để trống");
    if (!password) throw new Error("mật khẩu không được để trống");
    if (!rePassword) throw new Error("mật khẩu không được để trống");
    if (rePassword !== password)
      throw new Error("nhập lại mật khẩu không khớp");

    var salt = bcrypt.genSaltSync(10);
    var hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) throw new Error("có lỗi xảy ra");
    const payload = {
      username,
      email,
      password: hashPassword,
      role: "GENERAL",
    };
    const userData = new userModel(payload);
    const saveUser = await userData.save();
    res.status(201).json({
      data: saveUser,
      message: "Đăng ký thành công",
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
const updateController = async (req, res) => {
  try {
    const { userId, role } = req.body;

    console.log("userid and role", userId, role);

    const updateUser = await userModel.findByIdAndUpdate(userId, { role });

    res.json({
      message: "đã update quyền người dùng",
      data: updateUser,
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
const getUsersController = async (req, res) => {
  try {
    const users = await userModel.find();

    res.json({
      data: users,
      message: "users",
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
const userDetailsController = async (req, res) => {
  try {
    const UserId = req.userId;

    const user = await userModel.findById(UserId);

    res.json({
      data: user,
      message: "user",
      success: true,
      error: false,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body;

    const deleteUser = await userModel.findByIdAndDelete(userId);

    res.json({
      message: "Xoá thành công",
      data: deleteUser,
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
const countAddtoCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await carts.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.json({
        data: { count: 0 },
        message: "ok",
        error: false,
        success: true
      });
    }

    const count = cart.items.reduce((total, item) => total + item.quantity,0)
    
    return res.json({
      data:{
        count
      },
      message: "ok",
      error: false,
      success: true
    })
  } catch (error) {
    return res.json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
};
const addToCart = async(req, res) =>{
  try {
    const userId = req.userId
    const {productId, quantity=1} = req.body
    const product = await productModel.findById(productId)

    const cart = await carts.findOne({userId})
    if(cart) {
      const existingItem = cart.items.find(item => item.productId.toString() === productId)

      if(existingItem) {
        existingItem.quantity+=quantity
        console.log(existingItem.quantity);
        
        existingItem.totalPrice = existingItem.quantity*existingItem.price;
      }else{
        cart.items.push({
          productId: productId,
          quantity: quantity,
          price: product.sellingPrice*quantity||product.price*quantity,
        })
      }
      cart.totalAmount = cart.items.reduce((total,item)=>total+item.totalPrice, 0)
      const add = await cart.save()

      return res.json({
        message: "đã thêm sản phẩm vào giỏ hàng",
        data: add,
        error: false,
        success: true,
      })
    }else{
      const newCart = new carts({
        userId,
        items:[{
          productId: productId,
          quantity:quantity,
          price: product.sellingPrice || product.price,
          totalPrice: product.sellingPrice*quantity || product.price*quantity
        }],
        totalAmount: product.sellingPrice * quantity || product.price*quantity
      })
      const add = await newCart.save()

      return res.json({
        message: "đã thêm sản phẩm vào giỏ hàng",
        data: add,
        error: false,
        success: true,
      })
    }
  } catch (error) {
    console.error(error)
    return res.json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}
const getCart = async(req, res) =>{
  try {
    const userId = req.userId
    
    const cart = await carts.findOne({userId}).populate("items.productId").lean()
    
    if(!cart){
      res.json({
        message: "giỏ hàng trống",
      })
    }
    return res.json({
      message:"ok",
      data: cart,
      error: false,
      success:true,
    })
  } catch (error) {
    res.json({
      message: error.mesage|| error,
      error: true,
      success: false
    })
  }
}
const updateCart = async(req, res) => {
  try {
    const userId = req.userId
    const{productId, quantity} = req.body

    const cart = await carts.findOne({userId})

    const item = cart.items.find(item => productId===item.productId.toString())
    
    item.quantity = quantity
    item.totalPrice = quantity

    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice,0)

    const updateCart = await cart.save()

    return res.json({
      message:"ok",
      data: updateCart,
      success:true,
      error:false,
    })

  } catch (error) {
    return res.json({
      message:error.message|| error,
      data: updateCart,
      success:false,
      error:true,
    })
  }
}
const deleteCart = async(req, res) =>{
  try {
    const userId = req.userId
    const {productId} = req.body
    const cart = await carts.findOne({userId})
    cart.items = cart.items.filter(item => item.productId.toString()!==productId)
    cart.totalAmount = cart.items.reduce((sum, item)=> sum + item.totalPrice,0)
    const deleteCart = await cart.save()
    return res.json({
      data: deleteCart,
      message:"dã xoá sản phẩm khỏi giỏ hàng",
      success:true,
      error:false
    })
  } catch (error) {
    return res.json({
      message:error.mesage || error,
      success:false,
      error:true
    })
  }
}
module.exports = {
  userLogoutController,
  userSignInController,
  refreshTokenController,
  userSignUpController,
  updateController,
  getUsersController,
  userDetailsController,
  deleteUserController,
  countAddtoCart,
  addToCart,
  getCart,
  updateCart, 
  deleteCart
};
