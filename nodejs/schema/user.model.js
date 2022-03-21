const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  filename: String,
  pdf: String,
  protectedPDF: String,
})

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    firstname: String,
    lastname: String,
    phone: Number,
    wallet: String,
    projects: [ProjectSchema]
  })
);

module.exports = User;