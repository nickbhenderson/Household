if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const User = require("../models/user");
const Household = require("../models/Household");
const RentYear = require("../models/RentYear");

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL must be set");
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

const demoUser = {
  username: "demo",
  password: "DemoPassword123!",
  email: "demo@example.com",
  displayname: "Demo User",
  salary: 72000,
};

const createRentItems = (year, monthIndex) => {
  const baseItems = [
    {
      reason: "Rent",
      cost: 1450,
      date: new Date(year, monthIndex, 1),
      desc: "Monthly apartment rent.",
    },
    {
      reason: "Power Bill",
      cost: 135 + monthIndex,
      date: new Date(year, monthIndex, 7),
      desc: "Electric utility bill for the month.",
    },
    {
      reason: "Internet",
      cost: 80,
      date: new Date(year, monthIndex, 12),
      desc: "Monthly internet service.",
    },
    {
      reason: "Groceries",
      cost: 360 + monthIndex * 5,
      date: new Date(year, monthIndex, 18),
      desc: "Shared household groceries.",
    },
  ];

  if (monthIndex % 3 === 0) {
    baseItems.push({
      reason: "Household Supplies",
      cost: 95,
      date: new Date(year, monthIndex, 22),
      desc: "Cleaning supplies, paper goods, and other shared items.",
    });
  }

  return baseItems;
};

const seedDemoData = async () => {
  await mongoose.connect(dbUrl, {
    dbName: "Household",
  });

  console.log("Database connected");

const DEMO_INVITE_CODE = "DEMO-HOUSEHOLD";

  const existingDemoUser = await User.findOne({ username: demoUser.username });

  if (existingDemoUser) {
    console.log("Removing existing demo user and related demo household data...");

    const existingHousehold = await Household.findOne({
      users: existingDemoUser._id,
    });

    if (existingHousehold) {
      await RentYear.deleteMany({ household: existingHousehold._id });
      await Household.findByIdAndDelete(existingHousehold._id);
    }

    await User.findByIdAndDelete(existingDemoUser._id);
  }

  const user = new User({
    username: demoUser.username,
    email: demoUser.email,
    displayname: demoUser.displayname,
    salary: demoUser.salary,
  });

  const registeredUser = await User.register(user, demoUser.password);

  const household = new Household({
    name: "Demo Household",
    inviteCode: DEMO_INVITE_CODE,
    address: {
      street: "123 Portfolio Lane",
      city: "Madison",
      state: "AL",
      zip: "35758",
    },
    users: [registeredUser._id],
  });

  await household.save();

  const year = new Date().getFullYear();

  const rentYear = new RentYear({
    year,
    household: household._id,
    rentMonths: [],
    yearlyTotal: 0,
  });

  for (let i = 0; i < months.length; i++) {
    const rentItems = createRentItems(year, i);
    const rentTotal = rentItems.reduce((sum, item) => sum + Number(item.cost), 0);

    rentYear.rentMonths.push({
      year,
      month: months[i],
      rentItems,
      rentTotal,
    });

    rentYear.yearlyTotal += rentTotal;
  }

  await rentYear.save();

  household.rentYears.push(rentYear._id);
  await household.save();

  console.log("Demo seed complete.");
  console.log("--------------------------------");
  console.log("Demo login credentials:");
  console.log(`Username: ${demoUser.username}`);
  console.log(`Password: ${demoUser.password}`);
  console.log("--------------------------------");

  await mongoose.connection.close();
};

seedDemoData().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
  process.exit(1);
});