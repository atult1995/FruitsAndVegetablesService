const ProductModel = require("../model/Product");
const { ObjectId } = require("mongodb");

class ProductRepository {
  async createProduct({
    name,
    description,
    banner,
    unit,
    type,
    available,
    price,
    supplier,
  }) {
    try {
      const product = new ProductModel({
        name,
        description,
        banner,
        unit,
        available,
        type,
        price,
        supplier,
      });
      await product.save();
      return { response: product, message: "inserted", code: 200 };
    } catch (e) {
      console.log(e.message);
      return { response: e.message, code: 400 };
    }
  }

  async fetchProduct() {
    try {
      const product = await ProductModel.find({});
      return { response: product, code: 200, message: "product fetched" };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async fetchProductById({ _id }) {
    try {
      const product = await ProductModel.findById(_id);
      if (!product) throw new Error("There is tech issue");
      return { response: product, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }
  async fetchProductByCategory({ category }) {
    try {
      const product = await ProductModel.find({ type: category });
      if (!product) throw new Error("There is tech issue");
      return { response: product, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async fetchProductBySelectedId({ selectedIds }) {
    try {
      const product = await ProductModel.find()
        .where("_id")
        .in(selectedIds.map((_id) => _id))
        .exec();
      if (!product) throw new Error("There is tech issue");
      return { response: product, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async deleteProduct({ productId }) {
    try {
      let product = await ProductModel.deleteOne(new ObjectId(productId));
      console.log(productId);
      return { response: product, message: "Deleted successfully", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
}

module.exports = ProductRepository;
