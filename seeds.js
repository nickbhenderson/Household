if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const RentYear = require("./models/RentYear");
const Household = require("./models/Household");

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
  dbName: "Household",
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  const household = await Household.findOne({
    _id: "67094fd55f19de0fe10d0784",
  });
  const rentYear = await RentYear.findOne({ household });
  rentYear.rentMonths[2].rentItems.push(
    {
      reason: "Apartment Rent",
      cost: 1642,
      desc: "Rent charged in October for September in Unit 5103 at Henry House.",
      date: new Date("2024-10-01"),
    },
    {
      reason: "Power Bill",
      cost: 89,
      desc: "Power bill from HSV Utilities for Unit 5103 charged in October for the month of September.",
      date: new Date("2024-10-03"),
    },
    {
      reason: "ATT Internet Bill",
      cost: 80,
      desc: "Monthly Fiber bill",
      date: new Date("2024-10-03"),
    },
  );
  rentYear.rentMonths[2].rentTotal = 1642 + 169;

  // const September = {
  //     year: 2024,
  //     month: "September",
  //     rentItems: [{
  //         reason: "Apartment Rent",
  //         cost: 1638,
  //         desc: "Rent charged in September for August in Unit 5103 at Henry House.",
  //         date: new Date('2024-09-01')
  //     },
  //     {
  //         reason: "Power Bill",
  //         cost: 110,
  //         desc: "Power bill from HSV Utilities for Unit 5103 charged in September for the month of August.",
  //         date: new Date('2024-09-03')
  //     },
  //     {
  //         reason: "BJ's Trip",
  //         cost: 96,
  //         desc: "Groceries",
  //         date: new Date('2024-09-27')
  //     },
  //     {
  //         reason: "Aldi Trip",
  //         cost: 120,
  //         desc: "Groceries",
  //         date: new Date('2024-09-27')
  //     },
  //     ],
  //     rentTotal: 1964
  // }
  // rentYear.rentMonths.unshift(September);
  // const August = {
  //     year: 2024,
  //     month: "August",
  //     rentItems: [{
  //         reason: "Apartment Rent",
  //         cost: 1020,
  //         desc: "Rent charged in August for July in Unit 5103 at Henry House.",
  //         date: new Date('2024-08-01')
  //     },
  //     {
  //         reason: "Power Bill",
  //         cost: 66,
  //         desc: "Power bill from HSV Utilities for Unit 5103 charged in August for the month of July.",
  //         date: new Date('2024-08-03')
  //     }
  //     ],
  //     rentTotal: 1086
  // }
  // rentYear.rentMonths.unshift(August);
  console.log(rentYear);
  await rentYear.save();
};

seedDB().then(() => {
  mongoose.connection.close();
});
