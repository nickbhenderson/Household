const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  checkCurrentYear,
  checkCurrentMonth,
  checkHousehold,
  validateRentItem,
} = require("../middleware");
const livingExpenses = require("../controllers/living-expenses");
const catchAsync = require("../utils/catchAsync");

router
  .route("/")
  .get(
    isLoggedIn,
    checkHousehold,
    checkCurrentYear,
    checkCurrentMonth,
    catchAsync(livingExpenses.renderLivingExpenses),
  )
  .post(
    isLoggedIn,
    validateRentItem,
    catchAsync(livingExpenses.createLivingExpense),
  );

module.exports = router;
