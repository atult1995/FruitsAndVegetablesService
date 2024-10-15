const { globalVar } = require("../config");
const { CustomerRepository } = require("../database");
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async createCustomer(userInputs) {
    const { response, message, code } = await this.repository.createCustomer(
      userInputs
    );
    return { response, message, code };
  }

  async createAddress(userInputs) {
    const { response, code } = await this.repository.createAddress(userInputs);
    return { response, code };
  }

  async customerLogin(userInputs) {
    const { response, message, code } = await this.repository.customerLogin(
      userInputs
    );
    return { response, message, code };
  }

  async addToWishlist(userInputs) {
    const { response, code } = await this.repository.addToWishlist(userInputs);
    return { response, code };
  }

  async addToCart(userInputs) {
    const { response, message, code } = await this.repository.addToCartList(
      userInputs
    );
    return { response, message, code };
  }

  async getCustomerByIdAndToken(userInputs) {
    const { response, message, code } =
      await this.repository.getCustomerByIdAndToken(userInputs);
    return { response, message, code };
  }

  async getCustomerWishlist(userInputs) {
    const { response, code } = await this.repository.getCustomerWishlist(
      userInputs
    );
    return { response, code };
  }
  async getCustomerCart(userInputs) {
    const { response, code } = await this.repository.getCustomerCart(
      userInputs
    );
    return { response, code };
  }

  async deleteCartItems(userInputs) {
    const { response, code } = await this.repository.deleteCartItems(
      userInputs
    );
    return { response, code };
  }
  async deleteWishlistItems(userInputs) {
    const { response, code } = await this.repository.deleteWishlistItems(
      userInputs
    );
    return { response, code };
  }

  async deleteCartItem(userInputs) {
    const { response, code } = await this.repository.deleteCartItem(userInputs);
    return { response, code };
  }

  async deleteWishlistItem(userInputs) {
    const { response, code } = await this.repository.deleteWishlistItem(
      userInputs
    );
    return { response, code };
  }

  async customerLogout(userInputs) {
    const { response, message, code } = await this.repository.customerLogout(
      userInputs
    );
    return { response, code, message };
  }

  async customerLogoutFromAllTheSession(userInputs) {
    const { response, message, code } =
      await this.repository.customerLogoutFromAllTheSession(userInputs);
    return { response, message, code };
  }

  async createOrder(userInputs) {
    const { response, message, code } = await this.repository.createOrder(
      userInputs
    );
    return { response, message, code };
  }

  async SubscribeEvents(payload) {
    const { data, event } = payload;
    console.log(data, event);
    switch (event) {
      case "ADD_TO_WISHLIST":
        return this.addToWishlist(data);
      case "ADD_TO_CART":
        return this.addToCart(data);
      case "REMOVE_FROM_WISHLIST":
        break;
      case "REMOVE_FROM_CART":
        break;
      case "CLEAR_CART":
        return this.deleteCartItems(data);
      case "CLEAR_WISHLIST":
        break;
      case "GET_USER_BY_ID":
        break;
      case "CREATE_ORDER":
        return this.createOrder(data);
    }
  }
}

module.exports = CustomerService;
