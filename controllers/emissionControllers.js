const CountryData = require("../models/countryDataModel");
const User = require("../models/user");
const getByCountry = (req, res) => {
  const { country, start_year, end_year, parameter } = req.query;

  if (country === "")
    return res.status(400).json({
      error: "Please check country name.",
    });

  CountryData.find()
    .then((data) => {
      let result = data.filter(
        (obj) =>
          obj.country === country &&
          obj.year >= start_year &&
          obj.year <= end_year &&
          obj.parameter === parameter
      );
      if (result.length > 0) {
        res.json(result);
      } else {
        res.json({
          message:
            "No data found matching the parameters. Please check the parameters and try again",
        });
      }
    })

    .catch((error) => {
      return res.status(400).json({
        error: "Not able to find",
      });
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
  getByCountry,
  insertData,
};
