const colors = require("colors");
const fs = require("fs");

const dbConnect = require("./config/db.js");
const Bootcamp = require("./models/Bootcamp.js");
const Course = require("./models/Course.js");

// mongoose connect
dbConnect();

// load json data
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`)
);
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`));

// import Date
const importBootcamps = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		console.log(`Data imported...`.bgGreen);
		process.exit(0); // to exit terminal afer log
	} catch (error) {
		console.error(`${error.message}`.bgRed);
		process.exit(0);
	}
};

// remove Date
const removeBootcamps = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		console.log(`Data removed...`.bgGreen);
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
