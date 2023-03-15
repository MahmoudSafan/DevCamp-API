const router = require("express").Router();
const {
	register,
	login,
	getProfile,
	forgotPassword,
	restPassword,
} = require("../controllers/auth");
const { auth } = require("../middleware/auth.js");

router.post("/login", login);
router.post("/register", register);
router.get("/profile", auth, getProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", restPassword);

module.exports = router;
