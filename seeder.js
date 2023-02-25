const colors = require("colors");
const fs = require("fs");

const dbConnect = require("./config/db.js");
const Bootcamp = require("./models/Bootcamp.js");

// mongoose connect
dbConnect();

// load json Bootcamp data
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);

// import Bootcamps
const importBootcamps = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log(`Bootcamps imported...`.bgGreen);
		process.exit(0); // to exit terminal afer log
	} catch (error) {
		console.error(`${error.message}`.bgRed);
		process.exit(0);
	}
};

// remove Bootcamps
const removeBootcamps = async () => {
	try {
		await Bootcamp.deleteMany();
		console.log(`Bootcamps removed...`.bgGreen);
		process.exit(0);
	} catch (error) {
		console.error(`${error.message}`.bgRed);
		process.exit(0);
	}
};

if (process.argv[2] === "-i") {
	importBootcamps();
} else if (process.argv[2] === "-r") {
	removeBootcamps();
}
