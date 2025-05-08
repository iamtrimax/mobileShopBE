const jwt = require("jsonwebtoken");
const { success } = require("toastr");

const authToken = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    const token = authHeaders && authHeaders.split(" ")[1];
    
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
      return res.status(401).json({
        error: true,
        success: false,
        message: "bạn cần đăng nhập thực hiện tính năng này",
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: true,
          success: false,
          message: "lỗi server",
        });
      } else {
        req.userId = decoded?._id;
        req.userName = decoded?.userName;
      }

      next();
    });
  } catch (error) {
    req.userId = null;
    req.userName = null;
    next();
  }
};

module.exports = authToken;
