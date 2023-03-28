const mongoose = require("mongoose");

const countryDataSchema = mongoose.Schema(
  {
    country: {
      type: String,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    value: {
      type: mongoose.Decimal128,
      require: true,
    },
    parameter: {
      type: String,
      enum: ["CO2", "SO2", "NO2"],
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ghg_emissions", countryDataSchema);
