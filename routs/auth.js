const router = require("express").Router();
const { register, login, getProfile } = require("../controllers/auth");
const { auth } = require("../middleware/auth.js");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);

module.exports = router;
