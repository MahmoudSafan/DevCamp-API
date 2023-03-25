const mongoose = require("mongoose");
const ReviewSchema = mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please Enter Course Title"],
		maxlength: [100, "Name cannot be more than 50 charachter"],
	},
	text: {
		type: String,
		trim: true,
		required: true,
		maxlength: [500, "comment cannot be more than 500 charachter"],
	},
	rating: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, "Please add a rating between 1 and 10"],
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: "Bootcamp",
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// user can only add one review per bootcamp
// ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// static method to calculate the average of course tuition
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	try {
		const obj = await this.aggregate([
			{
				$match: { bootcamp: bootcampId },
			},
			{
				$group: { _id: "$bootcamp", averageRating: { $avg: "$rating" } },
			},
		]);
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageRating: Math.ceil(obj[0].averageRating),
		});
	} catch (error) {
		console.error(error);
	}
};

// update bootcamp's average rating after saving course
ReviewSchema.post("save", async function () {
	await this.constructor.getAverageRating(this.bootcamp);
});

// update bootcamp's average rating after deleting course
ReviewSchema.post("remove", async function () {
	await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
