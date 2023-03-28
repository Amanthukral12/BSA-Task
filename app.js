const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

const emissionRoutes = require("./Routes/emissionRoutes");
const authRoutes = require("./Routes/auth");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/ghg-emissions", emissionRoutes);
app.use("/ghg-emissions", authRoutes);

app.listen(port, () => console.log(`Server is running at port ${port}`));
