const Household = require("../models/Household");
const RentYear = require("../models/RentYear");
const { getCurrentYear, getCurrentMonth } = require("../utils/getCurrentDate");

function parseDateInput(dateString) {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

module.exports.renderLivingExpenses = async (req, res) => {
  const user = req.user;
  const household = await Household.findOne({ users: user._id }).populate(
    "rentYears",
  );
  const month = getCurrentMonth();

  if (!household) {
    req.flash("error", "You are not a part of any Household!");
    return res.redirect("/home");
  }

  return res.render("living-expenses/index", {
    household,
    month,
    page_name: "Living Expenses",
  });
};

module.exports.createLivingExpense = async (req, res) => {
  const user = req.user;
  const rentItem = req.body.rentItem;
  const cost = Number(rentItem.cost);

  if (Number.isNaN(cost)) {
    req.flash("error", "Please enter a valid cost.");
    return res.redirect("/living-expenses");
  }

let month;

if (rentItem.date) {
  const parsedDate = parseDateInput(rentItem.date);
  month = parsedDate.getMonth();
  rentItem.date = parsedDate;
} else {
  month = getCurrentMonth();
  rentItem.date = new Date();
}

  const household = await Household.findOne({ users: user._id });

  if (!household) {
    req.flash("error", "You are not part of a household.");
    return res.redirect("/household/new");
  }

  let rentYear = await RentYear.findOne({
    household: household._id,
    year: getCurrentYear(),
  });

  if (!rentYear) {
    req.flash("error", "No rent year found.");
    return res.redirect("/living-expenses");
  }

  if (req.body.recurring) {
    for (let i = 0; i < 12; i++) {
      const recurringRentItem = {
        ...rentItem,
        cost,
        date: new Date(getCurrentYear(), i),
      };

      rentYear.rentMonths[i].rentItems.push(recurringRentItem);
      rentYear.rentMonths[i].rentTotal += cost;
      rentYear.yearlyTotal += cost;
    }
  } else {
    rentItem.cost = cost;
    rentYear.rentMonths[month].rentItems.push(rentItem);
    rentYear.rentMonths[month].rentTotal += cost;
    rentYear.yearlyTotal += cost;
  }

  await rentYear.save();

  return res.redirect("/living-expenses");
};


module.exports.updateLivingExpense = async (req, res) => {
  const user = req.user;
  const { rentItemId } = req.params;
  const updatedRentItem = req.body.rentItem;

  const household = await Household.findOne({ users: user._id });

  if (!household) {
    req.flash("error", "You are not part of a household.");
    return res.redirect("/living-expenses");
  }

  const rentYear = await RentYear.findOne({
    household: household._id,
    "rentMonths.rentItems._id": rentItemId,
  });

  if (!rentYear) {
    req.flash("error", "Expense not found.");
    return res.redirect("/living-expenses");
  }

  for (const rentMonth of rentYear.rentMonths) {
    const rentItem = rentMonth.rentItems.id(rentItemId);

    if (rentItem) {
      const oldReason = rentItem.reason || "";
      const oldDesc = rentItem.desc || "";
      const oldCost = Number(rentItem.cost) || 0;
      const oldDate = rentItem.date ? new Date(rentItem.date) : null;

      const newReason = updatedRentItem.reason || "";
      const newDesc = updatedRentItem.desc || "";
      const newCost = Number(updatedRentItem.cost) || 0;
      const newDate = updatedRentItem.date ? parseDateInput(updatedRentItem.date) : oldDate;

      if (Number.isNaN(newCost)) {
        req.flash("error", "Please enter a valid cost.");
        return res.redirect("/living-expenses");
      }

      const oldDateValue = oldDate ? oldDate.toISOString().split("T")[0] : "";
      const newDateValue = newDate ? newDate.toISOString().split("T")[0] : "";

      const noChanges =
        oldReason === newReason &&
        oldDesc === newDesc &&
        oldCost === newCost &&
        oldDateValue === newDateValue;

      if (noChanges) {
        req.flash("error", "No changes were made.");
        return res.redirect("/living-expenses");
      }

      const oldMonthIndex = oldDate ? oldDate.getMonth() : rentYear.rentMonths.indexOf(rentMonth);
      const newMonthIndex = newDate ? newDate.getMonth() : oldMonthIndex;

      rentItem.reason = newReason;
      rentItem.cost = newCost;
      rentItem.desc = newDesc;
      rentItem.date = newDate;

      if (newMonthIndex !== oldMonthIndex) {
        rentMonth.rentItems.pull(rentItem._id);
        rentMonth.rentTotal = Number(rentMonth.rentTotal || 0) - oldCost;

        rentYear.rentMonths[newMonthIndex].rentItems.push(rentItem);
        rentYear.rentMonths[newMonthIndex].rentTotal =
          Number(rentYear.rentMonths[newMonthIndex].rentTotal || 0) + newCost;
      } else {
        rentMonth.rentTotal = Number(rentMonth.rentTotal || 0) - oldCost + newCost;
      }

      rentYear.yearlyTotal = Number(rentYear.yearlyTotal || 0) - oldCost + newCost;

      await rentYear.save();

      req.flash("success", "Expense updated successfully.");
      return res.redirect("/living-expenses");
    }
  }

  req.flash("error", "Expense not found.");
  return res.redirect("/living-expenses");
};

module.exports.deleteLivingExpense = async (req, res) => {
  const user = req.user;
  const { rentItemId } = req.params;

  const household = await Household.findOne({ users: user._id });

  if (!household) {
    req.flash("error", "You are not part of a household.");
    return res.redirect("/living-expenses");
  }

  const rentYear = await RentYear.findOne({
    household: household._id,
    "rentMonths.rentItems._id": rentItemId,
  });

  if (!rentYear) {
    req.flash("error", "Expense not found.");
    return res.redirect("/living-expenses");
  }

  for (const rentMonth of rentYear.rentMonths) {
    const rentItem = rentMonth.rentItems.id(rentItemId);

    if (rentItem) {
      const deletedCost = Number(rentItem.cost) || 0;

      rentItem.deleteOne();

      rentMonth.rentTotal = Number(rentMonth.rentTotal || 0) - deletedCost;
      rentYear.yearlyTotal = Number(rentYear.yearlyTotal || 0) - deletedCost;

      await rentYear.save();

      req.flash("success", "Expense deleted successfully.");
      return res.redirect("/living-expenses");
    }
  }

  req.flash("error", "Expense not found.");
  return res.redirect("/living-expenses");
};
