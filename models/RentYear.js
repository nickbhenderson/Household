const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentItemSchema = new Schema({
  reason: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  desc: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const rentMonthSchema = new Schema({
  year: Number,
  month: String,
  rentItems: [rentItemSchema],
  rentTotal: {
    type: Number,
    default: 0,
  },
});

const rentYearSchema = new Schema({
  year: Number,
  household: {
    type: Schema.Types.ObjectId,
    ref: "Household",
  },
  yearlyTotal: {
    type: Number,
    default: 0,
  },
  rentMonths: [rentMonthSchema],
});

module.exports = mongoose.model("RentYear", rentYearSchema);
