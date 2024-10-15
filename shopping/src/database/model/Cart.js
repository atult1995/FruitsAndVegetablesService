const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema({
  customerId: String,
  cart: [
    {
      product: {
        _id: { type: String, require: true },
        name: { type: String },
        description: { type: String },
        banner: { type: String },
        type: { type: String },
        unit: { type: Number },
        price: { type: Number },
        supplier: { type: String },
      },
      unit: Number,
    },
  ],
});

module.exports = mongoose.model("cart", CartSchema);
