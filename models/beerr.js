const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  imagebeer: String,
  abv: String,
  food: String,
  user: String
});

const Beeradd = mongoose.model("Beeradd", userSchema);

  
module.exports = Beeradd;

