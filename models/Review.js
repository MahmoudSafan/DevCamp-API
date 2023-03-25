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
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
