const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const { SECRET, PORT } = require("../../config");
const { generateAuthToken } = require("../../utils");

const Schema = mongoose.Schema;
const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      trim: true,
      type: "string",
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please provide valid email");
        }
      },
    },
    password: {
      trim: true,
      type: "string",
      minLength: 6,
      required: true,
      validate(value) {
        if (value.toLowerCase().includes("passwaord")) {
          throw new Error("Password must not contains 'password'");
        }
      },
    },
    phone: String,
    tokens: [
      {
        token: String,
      },
    ],
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        required: true,
      },
    ],
    cart: [
      {
        product: {
          _id: String,
          name: String,
          banner: String,
          price: Number,
        },
        unit: { type: Number, required: true },
      },
    ],
    wishlist: [
      {
        _id: String,
        name: String,
        banner: String,
        description: String,
        available: Boolean,
        price: Number,
      },
    ],
    orders: [
      {
        _id: String,
        amount: Number,
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password,
          delete ret.tokens,
          delete ret.__v,
          delete ret.wishlist,
          delete ret.cart;
        delete ret.order;
      },
    },
    timestamps: true,
  }
);

CustomerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, "7");
  }
  next();
});

CustomerSchema.methods.generateAuthToken = generateAuthToken;

CustomerSchema.statics.findByCred = async (email, password) => {
  try {
    const user = await CustomerModel.findOne({ email });

    if (user) {
      const verify = await bcryptjs.compare(password, user.password);
      if (verify) {
        return { response: user, message: "User logged in", code: 200 };
      }
      throw new Error("Bad cred");
    }
    throw new Error("Bad cred");
  } catch (e) {
    return { response: "", message: e.message, code: 400 };
  }
};

const CustomerModel = mongoose.model("user", CustomerSchema);
module.exports = CustomerModel;
