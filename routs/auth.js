const router = require("express").Router();
const {
	register,
	login,
	logout,
	getProfile,
	forgotPassword,
	restPassword,
	updateProfile,
	updatePassword,
} = require("../controllers/auth");
const { auth } = require("../middleware/auth.js");

router.post("/login", login);
router.get("/logout", auth, logout);
router.post("/register", register);
router.get("/profile", auth, getProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", restPassword);
router.put("/update-profile", auth, updateProfile);
router.put("/update-password", auth, updatePassword);

module.exports = router;
