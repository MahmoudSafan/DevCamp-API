const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

module.exports = {
	PORT: process.env.PORT || 5000,
	NODE_ENV: process.env.NODE_ENV,
	DB_URL: process.env.DB_URL,
	GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
	GEOCODER_APIKEY: process.env.GEOCODER_APIKEY,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN,
	COOKIES_EXPIRE_IN: process.env.COOKIES_EXPIRE_IN,
};
