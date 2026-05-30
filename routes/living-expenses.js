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

router
  .route("/:rentItemId")
  .put(
    isLoggedIn,
    checkHousehold,
    validateRentItem,
    catchAsync(livingExpenses.updateLivingExpense),
  )
  .delete(
    isLoggedIn,
    checkHousehold,
    catchAsync(livingExpenses.deleteLivingExpense),
  );

module.exports = router;
