const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
