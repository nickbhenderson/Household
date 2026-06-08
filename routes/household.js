const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  checkCurrentYear,
  checkCurrentMonth,
  checkHousehold,
  isHouseholdUser,
} = require("../middleware");
const household = require("../controllers/household");
const catchAsync = require("../utils/catchAsync");

router
  .route("/")
  .get(isLoggedIn, checkHousehold, catchAsync(household.index))
  .post(isLoggedIn, catchAsync(household.createHousehold));

router
  .route("/new")
  .get(isLoggedIn, household.renderNewForm);

router
  .route("/join")
  .get(isLoggedIn, household.renderJoinForm)
  .post(isLoggedIn, catchAsync(household.joinHousehold));

router
  .route("/:id")
  .get(
    isLoggedIn,
    isHouseholdUser,
    checkCurrentYear,
    checkCurrentMonth,
    catchAsync(household.showHousehold),
  )
  .put(isLoggedIn, isHouseholdUser, catchAsync(household.updateHousehold));

router
  .route("/:id/edit")
  .get(
    isLoggedIn,
    isHouseholdUser,
    checkCurrentYear,
    checkCurrentMonth,
    catchAsync(household.renderEditForm),
  );

module.exports = router;
