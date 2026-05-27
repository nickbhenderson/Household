const User = require("../models/user");
const Household = require("../models/Household");

module.exports.renderRegister = (req, res, next) => {
  res.render("user/register", { page_name: "Register" });
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, username, displayname, salary, password, verifiedPassword } =
      req.body;
    if (password !== verifiedPassword) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/register");
    }
    const user = new User({ email, username, displayname, salary });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Household!");
      res.redirect("/household/new");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res, next) => {
  res.render("user/login", { page_name: "Login" });
};

module.exports.login = async (req, res, next) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  const redirectUrl = res.locals.returnTo || "/";

  res.redirect(redirectUrl);
};

module.exports.renderProfile = async (req, res, next) => {
  const user = req.user;
  const household = await Household.findOne({ users: user._id });

  res.render("user/profile", { user, household, page_name: "Profile" });
};

module.exports.updateProfile = async (req, res, next) => {
  const user = req.user;
  const { displayname, email, salary } = req.body;
  if (!displayname && !email && !salary) {
    req.flash("error", "Please enter updated information!");
    return res.redirect("/profile");
  }
  if (displayname) {
    await User.findByIdAndUpdate(user.id, { displayname });
  }
  if (email) {
    await User.findByIdAndUpdate(user.id, { email });
  }
  if (salary) {
    await User.findByIdAndUpdate(user.id, { salary });
  }

  req.flash(
    "success",
    `You've successfully updated your ${displayname ? "real name " : ""}${email ? "email " : ""}${salary ? "salary " : ""}information!`,
  );
  res.redirect("/profile");
};

module.exports.updatePassword = async (req, res, next) => {
  const currentPassword = req.body.currentPassword;
  const verifyCurrentPassword = req.body.verifyPassword;
  const newPassword = req.body.password;
  if (currentPassword !== verifyCurrentPassword) {
    req.flash("error", "Passwords must match!");
    return res.redirect("/profile");
  } else if (newPassword === currentPassword) {
    req.flash(
      "error",
      "New password must be different from your old password!",
    );
    return res.redirect("/profile");
  } else {
    User.findByUsername(req.user.username, (err, user) => {
      if (err) {
        req.flash("error", err);
        return res.redirect("/profile");
      } else {
        user.changePassword(oldPassword, newPassword, (err) => {
          if (err) {
            console.log(err);
            req.flash("error", err);
            return res.redirect("/profile");
          } else {
            req.flash("success", "Password changed successfully.");
            return res.redirect("/profile");
          }
        });
      }
    });
  }
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};
