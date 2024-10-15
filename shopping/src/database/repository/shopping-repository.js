const { response } = require("express");
const { CartModel, OrderModel } = require("../model");
const { v4: uuidv4 } = require("uuid");

class ShoppingRepository {
  async createOrder({ customerId }) {
    try {
      const cart = await CartModel.findOne({ customerId });
      if (cart) {
        let amount = 0;
        let item = cart.cart;
        if (item.length) {
          item.forEach((i) => {
            amount += parseFloat(i.product.price) * parseInt(i.unit);
          });

          const orderId = uuidv4();
          const order = new OrderModel({
            customerId,
            orderId,
            amount,
            status: "paid",
            items: cart.cart,
          });
          await order.save();
          cart.customerId = "";
          cart.cart = [];
          await cart.save();
          return {
            response: order,
            message: "Successfully placed your order",
            code: 200,
          };
        }
        throw new Error("No cart found");
      } else {
        throw new Error("No cart found");
      }
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async addItemToCart({
    customerId,
    productId,
    name,
    description,
    banner,
    type,
    unit,
    price,
    supplier,
  }) {
    try {
      const cart = await CartModel.findOne({ customerId });
      if (cart) {
        cart.cart.push({
          product: {
            _id: productId,
            name,
            description,
            banner,
            type,
            price,
            supplier,
          },
          unit,
        });
        await cart.save();
        if (!cart) throw new Error("There is tech issue while adding to cart");
        return { response: cart, message: "Added to cart", code: 200 };
      } else {
        const newCart = new CartModel();
        newCart.customerId = customerId;
        newCart.cart.push({
          product: {
            _id: productId,
            name,
            description,
            banner,
            type,
            price,
            supplier,
          },
          unit,
        });
        await newCart.save();
        if (!newCart)
          throw new Error("There is tech issue while adding to cart");
        return { response: newCart, message: "Added to cart", code: 200 };
      }
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async incDecCartItemCount({ customerId, qty, action }) {
    try {
      const cart = await CartModel.findById(customerId);
      if (cart) {
        const findProduct = cart.cart.find(
          (item) => item.productId === productId
        );
        if (findProduct) {
          //inc or desc
          action === "inc" ? (findProduct.unit += 1) : (findProduct.unit -= 1);
          if (findProduct.unit === 0) {
            cart.cart = cart.cart.filter(
              (item) => item.productId !== findProduct.productId
            );
          }
          return { response: cart.cart, message: "updated", code: 200 };
        } else {
          throw new Error("No item found");
        }
      } else {
        throw new Error("No item found");
      }
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async deleteCartItems({ customerId }) {
    try {
      const cart = await CartModel.findOne({ customerId });
      if (!cart) throw new Error("Cart was not found");
      cart.cart = [];
      await cart.save();
      return { response: cart, message: "Cart is cleared", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async deleteCartItem({ customerId, productId }) {
    try {
      const cart = await CartModel.findOne({ customerId });

      cart.cart = cart.cart.filter((item) => item.product._id !== productId);
      console.log("deleted", cart);
      await cart.save();
      return { response: cart, message: "Cart is cleared", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }

  async getCustomerCart({ customerId }) {
    console.log("==== retriving =====");
    console.log(customerId);
    try {
      const cart = await CartModel.findOne({ customerId });
      console.log(cart);
      return { response: cart.cart, message: "Cart fetched", code: 200 };
    } catch (e) {
      return { response: "", message: e.message, code: 400 };
    }
  }
  async incCartQty({ customerId, productId }) {
    try {
      const cart = await CartModel.findOne({ customerId });

      cart.cart.forEach((c) => {
        if (c.product._id === productId) {
          c.unit += 1;
          return;
        }
      });

      await cart.save();
      return { response: cart.cart, message: "Updated quantity", code: 200 };
    } catch (e) {
      return { response: "", message: " cart not found", code: 400 };
    }
  }
  async decCartQty({ customerId, productId }) {
    try {
      const cart = await CartModel.findOne({ customerId });
      cart.cart.forEach((c) => {
        if (c.product._id === productId) {
          c.unit -= 1;
          if (c.unit === 0) {
            cart.cart = cart.cart.filter((c) => c._id === productId);
          }
        }
      });
      await cart.save();
      return { response: user.cart, message: "Updated quantity", code: 200 };
    } catch (e) {
      return { response: "", message: "cart not found", code: 400 };
    }
  }
}
module.exports = ShoppingRepository;
