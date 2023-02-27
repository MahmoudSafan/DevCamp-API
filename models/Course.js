const mongoose = require("mongoose");
const CourseSchema = mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please Enter Course Title"],
		maxlength: [100, "Name cannot be more than 50 charachter"],
	},
	description: {
		type: String,
		trim: true,
		required: true,
		maxlength: [500, "Name cannot be more than 50 charachter"],
	},
	weeks: {
		type: Number,
		required: true,
		default: 1,
	},
	tuition: {
		type: Number,
		default: 0,
	},
	minimumSkill: String,
	scholarShipAvailable: {
		type: Boolean,
		default: false,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: "Bootcamp",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Course", CourseSchema);
