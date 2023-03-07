const config = require("../config/config");
exports.sendTokenResponse = (res, statusCode, user) => {
	const token = user.getJwt();

	// set cookies options
	let options = {
		expires: new Date(
			Date.now() + config.COOKIES_EXPIRE_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	// enable cookies on https
	if (config.NODE_ENV === "production") options.secure = true;

	// send response to ctrl
	res.status(statusCode).cookie("token", token, options).json({
		sucsses: true,
		token,
	});
};
