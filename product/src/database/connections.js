const mongoose = require("mongoose");
const { DB_URL } = require("../config");
module.exports = async () => {
  try {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("==== connected ====");
  } catch (e) {
    console.log("==== error while connecting db ====");
    console.log(e.message);
  }
};
