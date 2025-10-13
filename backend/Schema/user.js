const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // ✅ Link each user to multiple bank accounts
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank" // Must match model name as a string
    }
  ]
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
