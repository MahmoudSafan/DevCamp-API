const router = require("express").Router();
const { register } = require("../controllers/auth");

// main route  /api/v1/auth

router.post("/register", register);

module.exports = router;
