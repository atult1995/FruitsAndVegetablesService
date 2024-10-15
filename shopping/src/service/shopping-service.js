const { ShoppingRepository } = require("../database");
const { LOGGED_IN_USER } = require("../utils");

class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async createOrder(userInputs) {
    const { response, message, code } = await this.repository.createOrder(
      userInputs
    );
    return { response, message, code };
  }
  async addItemToCart(userInputs) {
    const { response, message, code } = await this.repository.addItemToCart(
      userInputs
    );
    return { response, message, code };
  }
  async incDecCartItemCount(userInputs) {
    const { qty, action } = req.body;
    const customerId = req._id;
    const { response, message, code } =
      await this.repository.incDecCartItemCount({ customerId, qty, action });
    return { response, message, code };
  }

  async deleteCartItems(userInputs) {
    const { response, message, code } = await this.repository.deleteCartItems(
      userInputs
    );
    return { response, message, code };
  }

  async deleteCartItem(userInputs) {
    const { response, message, code } = await this.repository.deleteCartItem(
      userInputs
    );
    return { response, message, code };
  }

  async getCustomerCart(userInputs) {
    const { response, message, code } = await this.repository.getCustomerCart(
      userInputs
    );
    return { response, message, code };
  }

  async increaseCartQuantity(userInputs) {
    const { response, message, code } = await this.repository.incCartQty(
      userInputs
    );
    return { response, message, code };
  }
  async decreaseCartQuantity(userInputs) {
    const { response, message, code } = await this.repository.decCartQty(
      userInputs
    );
    return { response, message, code };
  }

  SubscribeEvents({ data, event }) {
    switch (event) {
      case "ADD_TO_CART":
        this.addItemToCart(data);
        break;
      case "REMOVE_FROM_CART":
        this.deleteCartItem(data);
        break;
      case "INC_QTY":
        this.increaseCartQuantity(data);
        break;
      case "DEC_QTY":
        this.decreaseCartQuantity(data);
        break;
    }
  }
}

module.exports = ShoppingService;
