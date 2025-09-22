const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    model: { type: String, required: true },
    year: Number,
    mpg: Number,
    age: Number,
    owner: { type: String, required: true } // GitHub user ID
});

module.exports = mongoose.model("Car", carSchema);
