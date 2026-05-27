const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo, isLoggedIn } = require("../middleware");
const user = require("../controllers/user");

router
  .route("/register")
  .get(user.renderRegister)
  .post(catchAsync(user.createUser));

router
  .route("/login")
  .get(user.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login,
  );

router
  .route("/profile")
  .get(isLoggedIn, catchAsync(user.renderProfile))
  .put(isLoggedIn, catchAsync(user.updateProfile));

router.route("/password").put(isLoggedIn, catchAsync(user.updatePassword));

router.get("/logout", user.logout);

module.exports = router;
