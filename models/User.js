const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter a name"],
		maxlength: 25,
		trim: true,
	},
	email: {
		type: String,
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please Enter valid email address",
		],
		required: [true, "Please enter an email"],
	},
	role: {
		type: String,
		enum: ["user", "publisher"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Password must be at least 8 characters"],
		minlength: 8,
		select: false,
	},
	resetPassswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// hash password before it's saved
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// create and return jwt
UserSchema.methods.getJwt = function () {
	return jwt.sign({ id: this.id }, config.JWT_SECRET, {
		expiresIn: config.JWT_EXPIRE_IN,
	});
};

UserSchema.methods.matchPassword = async function (typedPassword) {
	return await bcrypt.compare(typedPassword, this.password);
};

// create token to reset password
UserSchema.methods.generateResetToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");
	const hashToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.resetPassswordToken = hashToken;
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
