const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: String
  }
});

module.exports = mongoose.model("Hospital", hospitalSchema);
