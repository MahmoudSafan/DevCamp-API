const NodeGeocoder = require("node-geocoder");
const { GEOCODER_APIKEY, GEOCODER_PROVIDER } = require("../config/config");

const options = {
	provider: GEOCODER_PROVIDER,
	apiKey: GEOCODER_APIKEY,
	httpAdapter: "https",
	formatter: null,
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;
