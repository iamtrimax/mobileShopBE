const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const userLogoutController = async(req, res) =>{
    try {
       res.clearCookie("refreshToken")
       
       res.json({
        message: "đã đăng xuất",
        data: [],
        error:false,
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
          expiresIn:'1h',
        });
        const refreshToken = await jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET_KEY, {
          expiresIn: "7d",
        });

        res.cookie("refreshToken", refreshToken,{
          httpOnly: true,
          secure: false, // Bật khi dùng HTTPS
          sameSite: 'Strict',
          path: '/', // chỉ gửi cookie khi gọi đúng API này
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });
        res.status(200).json({
          message: "Đăng nhập thành công",
          data: token,
          error: false,
          success: true,
        })
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
  const refreshTokenController = async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) throw new Error("Không có refresh token");
  
      const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
  
      const newAccessToken = jwt.sign({
        _id: userData._id,
        email: userData.email,
        userName: userData.userName
      }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: '15m',
      });
  
      return res.status(200).json({
        accessToken: newAccessToken,
      });
  
    } catch (error) {
      console.log("err>>>>", error);
      
      return res.status(401).json({
        message: error.message|| error,
        error: true,
      });
    }
  };
  const userSignUpController = async (req, res) => {
    try {
       const {username, email, password, rePassword} = req.body;

       const user = await userModel.findOne({email})

       if(user)
        throw new Error("User đã tồn tại");
       if(!email)
        throw new Error("email không được để trống"); 
       if(!username)
        throw new Error("tên không được để trống"); 
       if(!password)
        throw new Error("mật khẩu không được để trống"); 
       if(!rePassword)
        throw new Error("mật khẩu không được để trống"); 
       if(rePassword !== password)
        throw new Error("nhập lại mật khẩu không khớp");
       
       var salt = bcrypt.genSaltSync(10)
       var hashPassword = await bcrypt.hashSync(password,salt)
       
       if(!hashPassword)
        throw new Error("có lỗi xảy ra")
       const payload ={
        username,
        email,
        password: hashPassword,
        role:"GENERAL",
       }
       const userData = new userModel(payload)
       const saveUser = await userData.save()
       res.status(201).json({
        data: saveUser,
        message:"Đăng ký thành công",
        error:false,
        success:true,
       })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
const updateController = async(req, res) => {
    try {
        const {userId, role} = req.body;

        console.log("userid and role", userId, role);
        

        const updateUser = await userModel.findByIdAndUpdate(userId, {role});

        res.json({
            message: "đã update quyền người dùng",
            data: updateUser,
            error:false,
            success:true,
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error:true,
            success:false,
        })
    }
}  
const getUsersController = async(req, res) => {
    try {
       const users = await userModel.find()
       
      res.json({
        data: users,
        message:"users",
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
const userDetailsController =  async(req, res) =>{
    try {
        
        const UserId = req.userId

        const user = await userModel.findById(UserId)

        res.json({
            data: user,
            message:"user",
            success: true,
            error: false
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            success: false,
            error: true
        })
    }    

}
const deleteUserController = async (req, res)   => {
    try {
        const {userId} = req.body;

        console.log("user delete: ",userId);
        

       const deleteUser = await userModel.findByIdAndDelete(userId);

        res.json({
            message: "Xoá thành công",
            data: deleteUser,
            error: false,
            success: true,
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success:false
        })
    }
}
module.exports = {userLogoutController, userSignInController, refreshTokenController, userSignUpController, updateController, getUsersController,userDetailsController, deleteUserController}