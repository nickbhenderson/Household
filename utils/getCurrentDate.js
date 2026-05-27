const options = {
  year: { year: "numeric" },
  month: { month: "long" },
};

module.exports.getCurrentMonth = () => {
  return new Date().getMonth();
};

module.exports.getCurrentYear = () => {
  return new Date().toLocaleString("default", options.year);
};
