const router = require("express").Router();
const { register, login } = require("../controllers/auth");

// main route  /api/v1/auth

router.post("/register", register);
router.post("/login", login);
module.exports = router;
