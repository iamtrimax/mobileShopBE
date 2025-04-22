const userModel = require("../models/user");

const uploadProductPermission = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) return false;
  else {
    if (user.role !== "ADMIN") return false;
    return true;
  }
};
module.exports = uploadProductPermission;
