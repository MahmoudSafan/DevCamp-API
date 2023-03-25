const Review = require("../models/Review.js");
const Bootcamp = require("../models/Bootcamp.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");

// @desc    get all reviews
// @routs   GET /reviews
// @routs   GET /bootcamps/:bootcampId/reviews
exports.getAllReviews = asyncHandler(async (req, res, next) => {
	const params = req.params;

	// get reviews in specific bootcamp
	if (params.bootcampId) {
		const reviews = await Review.find({ bootcamp: params.bootcampId });
		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		return res.status(200).json(res.advancedFilter);
	}
});

// @desc    get single review
// @routs   GET /reviews/:reviewId
exports.getSingleReview = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const review = await Review.findById(id).populate({
		path: "bootcamp",
		select: "name location.formattedAddress",
	});

	if (!review)
		return next(new ErrorResponse(`Review is not found with id: ${id}`, 404));

	return res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc   create review
// @routs  POST /bootcamps/:bootcampId/reviews
exports.createReview = asyncHandler(async (req, res, next) => {
	const { bootcampId } = req.params;
	req.body.bootcamp = bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(bootcampId);
	if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp is not found with id: ${id}`, 404));

	const review = await Review.create(req.body);

	return res.status(201).json({
		success: true,
		data: review,
	});
});
