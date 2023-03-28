const redis = require("redis");
const CountryData = require("../models/countryDataModel");
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
const getAllData = (req, res) => {
  res.status(200).json({ message: "Get All Data" });
};

const getByCountry = (req, res) => {
  const { country, start_year, end_year, parameter } = req.query;

  if (country === "") throw new Error("No country name passed");
  redisClient.get((err, data) => {
    if (data) {
      let result = data.filter(
        (obj) =>
          obj.country === country &&
          obj.year >= start_year &&
          obj.year <= end_year &&
          obj.parameter === parameter
      );
      res.json(result);
    } else {
      CountryData.find().then((data) => {
        let result = data.filter(
          (obj) =>
            obj.country === country &&
            obj.year >= start_year &&
            obj.year <= end_year &&
            obj.parameter === parameter
        );
        redisClient.set(country, JSON.stringify(result));
        res.json(result);
      });
    }
  });
};

const insertData = (req, res) => {
  const ghg_emissions = new CountryData(req.body);

  ghg_emissions
    .save()
    .then((ghg_emission) => {
      res.json({
        country: ghg_emission.country,
        year: ghg_emission.year,
        value: ghg_emission.value,
        parameter: ghg_emission.parameter,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        err: "Not able to to save",
      });
    });
};

module.exports = {
  getAllData,
  getByCountry,
  insertData,
};
