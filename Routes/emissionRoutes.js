const express = require("express");

const router = express.Router();
const {
  getByCountry,
  insertData,
} = require("../controllers/emissionControllers");
const { isSignedIn } = require("../controllers/auth");

router.get("/country", isSignedIn, getByCountry);

router.post("/", isSignedIn, insertData);

module.exports = router;
