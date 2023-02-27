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

// static method to calculate the average of course tuition
CourseSchema.statics.getAvgCost = async function (bootcampId) {
	try {
		const obj = await this.aggregate([
			{
				$match: { bootcamp: bootcampId },
			},
			{
				$group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } },
			},
		]);

		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost),
		});
	} catch (error) {
		console.error(error);
	}
};

// update bootcamp's average cost after saving course
CourseSchema.post("save", async function () {
	await this.constructor.getAvgCost(this.bootcamp);
});

// update bootcamp's average cost after deleting course
CourseSchema.post("remove", async function () {
	await this.constructor.getAvgCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
