const { default: mongoose } = require("mongoose");

const cartItemSchema = mongoose.Schema({
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'products', // Tham chiếu đến model Product
      required: true
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    price: { 
      type: Number, 
      required: true 
    },
    totalPrice: {
      type: Number,
      required: true,
      // Tính tổng giá cho mỗi sản phẩm: quantity * price
      default: function() {
        return this.quantity * this.price;
      }
    }
  }, { _id: false });
  
  // Tạo schema cho giỏ hàng của người dùng
  const cartSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Tham chiếu đến model users
      required: true
    },
    items: [cartItemSchema], // Mảng các sản phẩm trong giỏ hàng
    totalAmount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  const carts = mongoose.model("carts", cartSchema);

  module.exports = carts ;