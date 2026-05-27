const { rentItemSchema } = require("./schemas");
const RentYear = require("./models/RentYear");
const ExpressError = require("./utils/ExpressError");
const { getCurrentMonth, getCurrentYear } = require("./utils/getCurrentDate");
const Household = require("./models/Household");

module.exports.validateRentItem = (req, res, next) => {
  const { error } = rentItemSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }
  return next();
};

module.exports.checkCurrentYear = async (req, res, next) => {
  const household = await Household.findOne({ users: req.user._id });

  if (!household) {
    return res.redirect("/household/new");
  }

  const rentYear = await RentYear.findOne({
    year: getCurrentYear(),
    household: household,
  });

  if (!rentYear) {
    const newYear = new RentYear({
      year: getCurrentYear(),
      household,
    });
    household.rentYears.push(newYear);
    household.save();
    newYear.save();
  }
  return next();
};

module.exports.checkCurrentMonth = async (req, res, next) => {
  const household = await Household.findOne({ users: req.user._id });

  if (!household) {
    return res.redirect("/household/new");
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = await RentYear.findOne({
    year: getCurrentYear(),
    household: household._id,
  });

  if (!currentYear) {
    req.flash("error", "Could not find the current rent year.");
    return res.redirect("/household/new");
  }

  const existingMonths = new Set(
    currentYear.rentMonths.map((rentMonth) => rentMonth.month)
  );

  for (const month of months) {
    if (!existingMonths.has(month)) {
      currentYear.rentMonths.push({
        year: getCurrentYear(),
        month,
        rentItems: [],
        rentTotal: 0,
      });
    }
  }

  await currentYear.save();

  return next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  return next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  return next();
};

module.exports.checkHousehold = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const household = await Household.findOne({ users: req.user._id });
    if (!household) {
      return res.redirect("/household/new");
    }
  }
  return next();
};

module.exports.isHouseholdUser = async (req, res, next) => {
  const { id } = req.params;
  const household = await Household.findById(id);
  if (!household) {
    req.flash("error", "Household not found.");
    return res.redirect("/");
  }
  if (!household.users.includes(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/home`);
  }
  return next();
};
