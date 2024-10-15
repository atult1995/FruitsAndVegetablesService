const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  banner: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  unit: { type: Number, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  available: { type: Boolean, required: true, trim: true },
  supplier: { type: String, required: true, trim: true },
});

const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
