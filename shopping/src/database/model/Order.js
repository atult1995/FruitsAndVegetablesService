const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    customerId: String,
    amount: Number,
    status: String,
    items: [
      {
        product: {
          _id: String,
          name: String,
          banner: String,
          description: String,
          price: Number,
          type: String,
          unit: String,
          supplier: String,
        },
        unit: Number,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
