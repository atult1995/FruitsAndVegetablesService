const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  street: String,
  postalCode: String,
  city: String,
  country: String,
  addressType: {
    type: "string",
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("address", AddressSchema);
