const router = require("express").Router();
const bootcampas = require("./bootcamps.js");

router.use("/bootcamps", bootcampas);

module.exports = router;
