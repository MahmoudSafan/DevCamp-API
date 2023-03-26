module.exports.errorHandler = (err, req, res, next) => {
	const error = { ...err };
	error.message = err.message;

	// mongoose ObjectId Error
	if (err.kind === "ObjectId") {
		error.message = `Resource's id: ${error.value} is not valid`;
		error.statusCode = 400;
	}

	// mongoose Duplicated fields
	if (err.code === 11000) {
		const duplicated = Object.keys(error.keyValue);
		error.message = `${duplicated} is used before enter an uniqe ${duplicated}`;
		error.statusCode = 400;
	}

	// mongoose required fields
	if (err.name === "ValidationError") {
		const required = Object.values(error.errors).map((value) => value.path);
		error.message =
			required.length > 1
				? `${required} are required`
				: `${required} is required`;

		error.statusCode = 400;
	}

	// mongoose validation error
	if (err.name === "CastError") {
		error.message = `${err.path} is not valid`;
		error.statusCode = 400;
	}

	res.status(error.statusCode || 500).json({
		sucess: false,
		message: error.message || "Internal Server Error",
	});
};
