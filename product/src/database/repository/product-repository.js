const ProductModel = require("../model/Product");

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
      if (!product) throw new Error("there is tech issue");
      return { response: product, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async fetchProduct() {
    try {
      const product = await ProductModel.find({});
      if (!product) throw new Error("There is tech issue");
      return { response: product, code: 200 };
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
}

module.exports = ProductRepository;
