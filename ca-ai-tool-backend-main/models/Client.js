const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientName: String,
  businessName: String,
  gstNumber: String,
  email: String,
  phone: String,
});

module.exports = mongoose.model("Client", clientSchema);