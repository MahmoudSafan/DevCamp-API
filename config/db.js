const mongoose = require("mongoose");
const config = require("./config.js");

const dbConnect = async () => {
	const conn = await mongoose.set("strictQuery", true).connect(config.DB_URL);

	console.log(
		`DB ${conn.connection.name} on host: ${conn.connection.host}`.bgCyan.bold
	);
};

module.exports = dbConnect;
