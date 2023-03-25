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

// @desc    update review
// @routs   PUT /reviews/:reviewId
exports.updateReview = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	let review = await Review.findById(id);
	if (!review)
		return next(new ErrorResponse(`Review is not found with id: ${id}`, 404));

	// check if user is owner or he's an admin or not
	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(`You are not authorized to update this review`, 401)
		);
	}

	const updatedData = {
		title: req.body.title || review.title,
		text: req.body.text || review.text,
	};

	review.title = updatedData.title;
	review.text = updatedData.text;
	review = await review.save();

	return res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc    delete review
// @routs   DELETE /reviews/:reviewId
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const review = await Review.findById(id);
	if (!review)
		return next(new ErrorResponse(`Review is not found with id: ${id}`, 404));

	// check if user is owner or he's an admin or not
	if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(`You are not authorized to delete this review`, 401)
		);
	}
	await review.remove();
	return res.status(200).json({
		success: true,
		data: {},
	});
});
