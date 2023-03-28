const fs = require("fs");
const csv = require("csv-parser");
const express = require("express");
const mongoose = require("mongoose");
const CountryData = require("../models/countryDataModel");
const app = express();
const port = 8001;
const dbUrl = "mongodb://0.0.0.0:27017/ghg_emissions";

// Connect to MongoDB database using Mongoose
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

// Define endpoint for inserting data
app.post("/ghg-emissions", (req, res) => {
  // Read data from CSV file
  fs.createReadStream("./greenhouse_gas_inventory_data.csv")
    .pipe(csv())
    .on("data", (ghg_emission) => {
      //console.log(ghg_emission);
      // Create a new document from each row of data and save it to the database
      const ghg_emissions = new CountryData({
        country: ghg_emission.country_or_area,
        year: ghg_emission.year,
        value: ghg_emission.value,
        parameter: ghg_emission.parameter,
      });

      ghg_emissions
        .save()
        .then(() => {})
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            error: "Not able to to save",
          });
        });
    })
    .on("end", () => {
      console.log("Finished inserting data");
      res.send("Data inserted successfully");
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
