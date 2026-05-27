const Household = require("../models/Household");
const RentYear = require("../models/RentYear");
const { getCurrentYear, getCurrentMonth } = require("../utils/getCurrentDate");

module.exports.renderLivingExpenses = async (req, res) => {
  const user = req.user;
  const household = await Household.findOne({ users: user._id }).populate(
    "rentYears",
  );
  const month = getCurrentMonth();
  console.log(month);
  if (!household) {
    req.flash("error", "You are not a part of any Household!");
    return res.redirect("/home");
  }

  res.render("living-expenses/index", {
    household,
    month,
    page_name: "Living Expenses",
  });
};

module.exports.createLivingExpense = async (req, res) => {
  const user = req.user;
  const rentItem = req.body.rentItem;

  // Check to see if a date was provided. If not, defaults to the current day.
  let month = 0;
  if (rentItem.date) {
    month = new Date(rentItem.date).getMonth();
  } else {
    month = getCurrentMonth();
    rentItem.date = new Date();
  }

  const household = await Household.findOne({ users: user._id }).populate(
    "rentYears",
  );
  let rentYear = await RentYear.find({ household });
  rentYear = rentYear[rentYear.length - 1];
  if (req.body.recurring) {
    for (let i = 0; i < 12; i++) {
      rentItem.date = new Date(getCurrentYear(), i);
      rentYear.rentMonths[i].rentItems.push(rentItem);
      rentYear.rentMonths[i].rentTotal += parseInt(rentItem.cost);
      rentYear.yearlyTotal += parseInt(rentItem.cost);
      console.log(rentItem.date);
    }
  } else {
    rentYear.rentMonths[month].rentItems.push(rentItem);
    rentYear.rentMonths[month].rentTotal += parseInt(rentItem.cost);
    rentYear.yearlyTotal += parseInt(rentItem.cost);
  }
  await rentYear.save();

  res.redirect("/living-expenses");
};
