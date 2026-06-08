const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  street: String,
  street2: String,
  city: String,
  state: String,
  zipcode: String,
  country: {
    type: String,
    default: "United States",
  },
});

const recurringExpenseSchema = new Schema({
  reason: String,
  cost: {
    type: Number,
    min: 0,
    default: 0,
  },
  desc: String,
});

const household = new Schema({
  name: {
    type: String,
    default: "Home",
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  ],
  address: addressSchema,
  recurringExpenses: [recurringExpenseSchema],
  rentYears: [
    {
      type: Schema.Types.ObjectId,
      ref: "RentYear",
    },
  ],
  inviteCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  inviteCodeCreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Household", household);
