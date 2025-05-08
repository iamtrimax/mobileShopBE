const { success } = require("toastr");
const comment = require("../models/comments");

const uploadComment = async (req, res) => {
  try {
    const { content, productId, parentId } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(403).json({
        message: "đăng nhập để đánh giá sản phẩm",
        error: true,
        success: false,
      });
    }
    const payload = {
      userId,
      content,
      productId,
      parentId: parentId || null,
    };
    const newcomment = new comment(payload);

    const saveComment = await newcomment.save();

    res.status(200).json({
      data: saveComment,
      message: "Đã đánh giá sản phẩm",
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
const getComments = async (req, res) => {
  try {
    const comments = await comment
      .find({ productId: req.params.productId })
      .populate("userId", "username").lean();

    const builtTree = (parentId = null) =>
      comments
        .filter((c) => String(c.parentId) === String(parentId))
        .map((c) => ({
          ...c,
          replies: builtTree(c._id),
        }));
    const tree = builtTree(null);

    res.json({
      data: tree,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message: error.message || error, 
        error: true,
        success: false
    })
  }
};

module.exports = { uploadComment, getComments };
