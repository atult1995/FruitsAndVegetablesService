const mongoose = require("mongoose");
const { AddressModel, CustomerModel } = require("../model");
const { response } = require("express");
const { globalVar } = require("../../config");

//dealing with database
class CustomerRepository {
  async createCustomer({ name, email, password, phone }) {
    try {
      const existingUser = await CustomerModel.findOne({ email });
      if (existingUser) throw new Error("Existing user");
      const user = await new CustomerModel({
        name,
        email,
        password,
        phone,
      });
      const token = await user.generateAuthToken();
      await user.save();
      return {
        response: { user, token },
        message: "User created successfully",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async customerLogin({ email, password }) {
    try {
      const { response, code, message } = await CustomerModel.findByCred(
        email,
        password
      );
      const token = await response.generateAuthToken();
      return { response: { user: response, token }, code, message };
    } catch (e) {
      return { response: "", code: 400, message: e.message };
    }
  }

  async createAddress({ customerId: _id, street, postalCode, country }) {
    try {
      const profile = await CustomerModel.findById(_id);
      const address = await new AddressModel({
        street,
        country,
        postalCode,
        country,
      });
      await address.save();
      //profile.address.push(address);
      profile.address = {
        addressId: address._id,
      };
      await profile.save();
      return { response: address, message: "Created address", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async addToWishlist({
    customerId: _id,
    productId,
    banner,
    description,
    available,
    price,
  }) {
    try {
      const user = await CustomerModel.findById(_id);
      user.wishlist.push({
        _id: productId,
        banner,
        description,
        available,
        price,
      });
      await user.save();
      return {
        response: user.wishlist,
        message: "fetched wishlist",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async addToCartList({
    customerId: _id,
    productId,
    banner,
    price,
    name,
    unit,
  }) {
    try {
      const user = await CustomerModel.findById(_id);
      user.cart.push({
        product: {
          _id: productId,
          banner,
          price,
          name,
          unit,
        },
        unit,
      });
      await user.save();
      return { response: user.cart, message: "Added to cart", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async getCustomerByIdAndToken({ customerId: _id, token }) {
    try {
      const user = await CustomerModel.findOne({ _id, "tokens.token": token });

      return { response: user, message: "User found", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async getCustomerAddress({ customerId: _id }) {
    try {
      const user = await CustomerModel.findById(_id);
      const address = await AddressModel.findById(user.address);
      return {
        response: user.cart,
        message: "fetched user address ",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async getCustomerCart({ customerId: _id }) {
    try {
      const user = await CustomerModel.findById(_id.toString());
      if (!user) throw new Error("User was not found");
      return {
        response: user.cart,
        message: "fetched customer cart",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async incCartQty({ customerId: _id, productId }) {
    try {
      const user = await CustomerModel.findById(_id);
      user.cart.forEach((cart) => {
        if (cart.product._id === productId) {
          cart.unit += 1;
          return;
        }
      });
      await user.save();
      return { response: user.cart, message: "Updated quantity", code: 200 };
    } catch (e) {
      return { response: "", message: "user or cart not found", code: 400 };
    }
  }
  async decCartQty({ customerId: _id, productId }) {
    try {
      const user = await CustomerModel.findById(_id);
      user.cart.forEach((cart) => {
        if (cart.product._id === productId) {
          cart.unit -= 1;
          if (cart.unit === 0) {
            user.cart = user.cart.filter((c) => c._id === productId);
          }
        }
      });
      await user.save();
      return { response: user.cart, message: "Updated quantity", code: 200 };
    } catch (e) {
      return { response: "", message: "user or cart not found", code: 400 };
    }
  }

  async getCustomerWishlist({ customerId: _id }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      return {
        response: user.wishlist,
        message: "fetched wishlist",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async deleteCartItems({ customerId: _id }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.cart = [];
      await user.save();
      return { response: user.cart, message: "cleared cart", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async deleteWishlistItems({ customerId: _id, productId }) {
    try {
      const user = await CustomerModel.findById(_id);
      user.wishlist = user.wishlist.filter((wish) => wish._id !== productId);
      await user.save();
      return {
        response: user.wishlist,
        message: "cleared wishlist",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async deleteCartItem({ customerId: _id, productId }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.cart = user.cart.filter((item) => item.product._id !== productId);
      await user.save();
      return { response: user.cart, message: "removed from cart ", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async deleteWishlistItem({ customerId: _id, productId }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.cart = user.wishlist.filter((item) => item._id !== productId);
      await user.save();
      return {
        response: user.wishlist,
        message: "Removed from wishlist",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async customerLogout({ customerId: _id, token }) {
    try {
      const user = await CustomerModel.findById(_id);

      if (!user) throw new Error("User was not found");

      user.tokens = user.tokens.filter((t) => t.token !== token);
      await user.save();
      return { response: "", message: "Logout successfully", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async customerLogoutFromAllTheSession({ customerId: _id, token }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");

      user.tokens = [];
      await user.save();
      return {
        response: "",
        message: "Logout from all the active session",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async createOrder({ customerId: _id, orderId, amount }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");

      user.orders.push({ _id: orderId, amount, date: new Date() });
      user.cart = [];
      await user.save();
      return {
        response: "",
        message: "Order details saved in user profile",
        code: 200,
      };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
}

module.exports = CustomerRepository;
