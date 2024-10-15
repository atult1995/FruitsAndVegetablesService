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

  ShoppingEvents({ data, event }) {
    switch (event) {
      case "ADD_TO_CART":
        return this.addItemToCart(data);
      case "USER_LOGGED_IN":
        LOGGED_IN_USER.user = data.user;
        LOGGED_IN_USER.token = data.token;
        if (LOGGED_IN_USER.user?._id !== "" && LOGGED_IN_USER.token !== "") {
          return {
            response: "",
            message: "Notification has got in shopping side",
            code: 200,
          };
        } else {
          return {
            response: "",
            message: "Notification has got but unable to push in shopping side",
            code: 400,
          };
        }
      case "USER_LOGGED_OUT":
        console.log;
        LOGGED_IN_USER.user = {};
        LOGGED_IN_USER.token = "";
        if (!LOGGED_IN_USER.user?.id && LOGGED_IN_USER.token === "") {
          return {
            response: "",
            message: "Notification has got in shopping side",
            code: 200,
          };
        } else {
          return {
            response: "",
            message: "Notification has got but unable to push in shopping side",
            code: 400,
          };
        }
    }
  }
}

module.exports = ShoppingService;
