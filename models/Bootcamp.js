const mongoose = require("mongoose");
const geocoder = require("../utils/GeoCoder.js");
const slugify = require("slugify");

const BootcampSchema = mongoose.Schema(
	{
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
		address: {
			type: String,
			maxlength: [50, "Address cannot be more than be 50 character"],
			required: true,
			trime: true,
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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// GeoCoder & Create location
BootcampSchema.pre("save", async function (next) {
	const geoLocation = await geocoder.geocode(this.address);

	this.location = {
		type: "Point",
		coordinates: [geoLocation[0].longitude, geoLocation[0].latitude],
		formattedAddress: geoLocation[0].formattedAddress,
		street: geoLocation[0].streetName,
		city: geoLocation[0].city,
		state: geoLocation[0].state,
		zipCode: geoLocation[0].zipcode,
		country: geoLocation[0].countryCode,
	};

	next();
});

// create slug from Bootcamp's name
BootcampSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { trim: true, lower: true });
	next();
});

// reverse populate with virtuals
BootcampSchema.virtual("courses", {
	ref: "Course",
	localField: "_id",
	foreignField: "bootcamp",
	justOne: false, // we want array not single object
});

// cascading remove courses when Bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
	await this.model("Course").deleteMany({ bootcamp: this._id });
	next();
});
module.exports = mongoose.model("Bootcamp", BootcampSchema);
