const Review = require("../models/Review.js");
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
