const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const prodctSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  image: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
},
  timestamp: { type: Date, default: Date.now(), required: false },
  rating: { type: Number, default: 0, required: true },
  numReviews: { type: Number, default: 0, required: true },
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Product", prodctSchema);
