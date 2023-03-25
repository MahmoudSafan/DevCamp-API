const router = require("express").Router();
const User = require("../models/User.js");
const {
	createUser,
	getAllUsers,
	getUser,
	updateUser,
	deleteUser,
} = require("../controllers/users.js");

//@desc		advancedFilter is middleware takes model and populate model to advanc filter
const { advancedFilter } = require("../middleware/advancedFilter.js");
const { auth, accessRole } = require("../middleware/auth.js");

router.use(auth, accessRole("admin"));

router.route("/").get(advancedFilter(User), getAllUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
