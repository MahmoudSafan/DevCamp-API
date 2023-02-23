const mongoose = require("mongoose");

const BootcampSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter a name"],
		trim: true,
		unique: true,
		maxlength: [50, "Name cannot be more than 50 charachter"],
	},
	description: {
		type: String,
		trim: true,
		required: [true, "Please enter a description"],
		maxlength: [500, "Description cannot be more than 500 charachter"],
	},
	email: {
		type: String,
		required: [true, "Please enter a mail address"],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please Enter valid email address",
		],
	},
	website: {
		type: String,
		match: [
			/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
			"Please enter valid url",
		],
	},
	slug: {
		type: String,
	},
	image: {
		type: String,
		default: "no_image.jpg",
	},
	phone: {
		type: String,
	},
	careers: {
		type: [String],
		required: [true, "Please enter a valid carrer category"],
		enum: [
			"Software Engineering",
			"Web Development",
			"Mobile Development",
			"Information Technology",
			"Data Science",
			"UI/UX",
			"Business",
			"Other",
		],
	},
	jobAssistance: {
		type: Boolean,
		default: false,
	},
	jobGuarantee: {
		type: Boolean,
		default: false,
	},
	acceptGi: {
		type: Boolean,
		default: false,
	},
	housing: {
		type: Boolean,
		default: false,
	},
	location: {
		// GeoJSON Point
		type: {
			type: String,
			enum: ["Point"],
			// required: true,
		},
		coordinates: {
			type: [Number],
			// required: true,
			index: "2dsphere",
		},

		formattedAddress: {
			type: String,
			// required: [true, "Please Enter an Address"],
		},
		street: String,
		city: String,
		state: String,
		zipCode: String,
		country: String,
	},
	averageRating: {
		type: Number,
		min: [1, "Rating must be at least 1"],
		max: [10, "Rating cannot be more than 10"],
	},
	averageCost: {
		type: Number,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
