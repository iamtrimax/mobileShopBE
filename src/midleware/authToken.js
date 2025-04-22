const jwt = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization
    const token = authHeaders && authHeaders.split(" ")[1];

    if (!token) {
      return res.status(401).json({error:"no token or invalid"});
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(401).json({error:"no token or invalid"});
      }

      req.userId = decoded?._id;
      req.userName = decoded?.userName;

      next();
    });
  } catch (error) {
    console.log("Lỗi middleware authToken:", error);
    req.userId = null;
    req.userName = null;
    next();
  }
};

module.exports = authToken;
