const { ProductRepository } = require("../database");

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(userInputs) {
    return await this.repository.createProduct(userInputs);
  }

  async fetchProduct() {
    return await this.repository.fetchProduct();
  }

  async fetchProductById({ _id }) {
    return await this.repository.fetchProductById({ _id });
  }
}

module.exports = ProductService;
