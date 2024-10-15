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
      if (code === globalVar.CODE.SUCCESS) {
        const token = await response.generateAuthToken();
        return { response: { user: response, token }, code, message };
      } else {
        return { response, code, message };
      }
    } catch (e) {
      return { response: "", code: 400, message: e.message };
    }
  }

  async createAddress({ _id, street, postalCode, country }) {
    try {
      console.log(_id);
      const profile = await CustomerModel.findById(_id);
      if (profile) {
        const address = await new AddressModel({
          street,
          country,
          postalCode,
          country,
        });
        await address.save();
        profile.address.push(address);
        await profile.save();
        return { response: address, code: 200 };
      }
      throw new Error("there is tech issue");
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }
  async addToWishlist({
    _id,
    productId,
    banner,
    description,
    available,
    price,
  }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.wishlist.push({
        _id: productId,
        banner,
        description,
        available,
        price,
      });
      await user.save();
      return { response: user.wishlist, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async addToCartList({ _id, productId, banner, price, name, unit }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
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

  async getCustomerByIdAndToken({ _id, token }) {
    console.log(_id);
    console.log(token);
    try {
      const user = await CustomerModel.findOne({ _id, "tokens.token": token });
      console.log(user);
      if (!user) throw new Error("User was not found");
      return { response: user, message: "User found", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async getCustomerAddress({ _id }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      return { response: user.cart, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async getCustomerCart({ _id }) {
    try {
      console.log(_id);
      const user = await CustomerModel.findById(_id.toString());
      if (!user) throw new Error("User was not found");
      return { response: user.cart, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }
  async getCustomerWishlist({ _id }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      return { response: user.wishlist, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async deleteCartItems({ _id }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.cart = [];
      await user.save();
      return { response: user.cart, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }
  async deleteWishlistItems({ _id }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.wishlist = [];
      await user.save();
      return { response: user.wishlist, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }
  async deleteCartItem({ _id, productId }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.cart = user.cart.filter((item) => item.product._id !== productId);
      await user.save();
      return { response: user.cart, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async deleteWishlistItem({ _id, productId }) {
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");
      user.cart = user.wishlist.filter((item) => item._id !== productId);
      await user.save();
      return { response: user.wishlist, code: 200 };
    } catch (e) {
      return { response: e.message, code: 400 };
    }
  }

  async customerLogout({ _id, token }) {
    console.log(_id, token);
    try {
      const user = await CustomerModel.findById(_id);
      console.log(user);
      if (!user) throw new Error("User was not found");

      user.tokens = user.tokens.filter((t) => t.token !== token);
      await user.save();
      return { response: "", message: "Logout successfully", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async customerLogoutFromAllTheSession({ _id, token }) {
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

  async createOrder({ _id, orderId, amount }) {
    console.log(_id, orderId, amount);
    try {
      const user = await CustomerModel.findById(_id);
      if (!user) throw new Error("User was not found");

      user.orders.push({ _id: orderId, amount, date: new Date() });
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
