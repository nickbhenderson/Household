const Household = require("../models/Household");
const RentYear = require("../models/RentYear");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const user = req.user;
  const household = await Household.findOne({ users: user._id });

  if (!household) {
    return res.redirect("/household/new");
  }

  return res.redirect(`/household/${household._id}`);
};

module.exports.renderNewForm = (req, res) => {
  const user = req.user;

  res.render("household/new", { page_name: "New Household", user });
};

module.exports.createHousehold = async (req, res) => {
  const user = await User.findOne(req.user);
  if (req.body.household.name) {
    const household = new Household({ name: req.body.household.name });
    household.address = req.body.address;
    household.users.push(user._id);
    await household.save();
    return res.redirect(`/household/${household._id}`);
  } else {
    req.flash("error", "Please submit a name for your Household!");
    return res.redirect("/");
  }
};

module.exports.showHousehold = async (req, res) => {
  const { id } = req.params;
  const household = await Household.findById(id).populate({ path: "users" });
  const rentYears = await RentYear.find({ household });
  const numMonths = rentYears[rentYears.length - 1].rentMonths.length;
  const month = new Date().getMonth();
  const householdSalary = household.users.reduce(
    (totalSalary, user) => totalSalary + user.salary,
    0,
  );
  const salary = [];
  for (let i = 0; i < numMonths; i++) salary.push(householdSalary / 12);

  res.render("household/show", {
    household,
    month,
    salary,
    rentYears,
    page_name: "Household",
  });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const household = await Household.findById(id);
  res.render("household/edit", { household, page_name: "Edit Household" });
};

module.exports.updateHousehold = async (req, res, next) => {
  const { id } = req.params;
  const household = await Household.findById(id);
  if (req.body.address) {
    household.address = req.body.address;
    await household.save();
    req.flash("success", "Successfully updated your Household's address!");
    return res.redirect(`/household/${id}`);
  } else if (req.body.household.name) {
    household.name = req.body.household.name;
    await household.save();
    req.flash("success", "Successfully updated your Household's name!");
    return res.redirect(`/household/${id}`);
  }
};
