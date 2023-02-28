exports.advancedFilter = (model, populate) => async (req, res, next) => {
	let reqQuery = { ...req.query };
	const removeFildes = ["select", "sort", "page", "limit"];

	//remove fields from reqQuery
	removeFildes.forEach((element) => delete reqQuery[element]);

	//create comparison operators $lt, $gt...
	const queryString = JSON.stringify(reqQuery).replace(
		/\b(gt|gte|lt|lte|in)\b/,
		(match) => `$${match}`
	);

	let filter = JSON.parse(queryString);
	let dbQuery = model.find(filter);

	if (populate) {
		dbQuery.populate(populate);
	}

	// select which data will retrive from Bootcamp
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		dbQuery.select(fields);
	}

	// sort date by fields || default is sorting by createdAt
	if (req.query.sort) {
		const fields = req.query.sort.split(",").join(" ");
		dbQuery.sort(fields);
	} else {
		dbQuery.sort("-createdAt"); // -fields === sort descending
	}

	// pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	dbQuery.skip(startIndex).limit(limit);

	// Execut query
	const results = await dbQuery;

	// pagination results
	const pagination = {};

	// next page
	if (endIndex < total) {
		pagination.next = { page: page + 1, limit };
	}

	//previous page
	if (startIndex > 0) {
		pagination.previous = { page: page - 1, limit };
	}

	res.advancedFilter = {
		success: true,
		pagination,
		count: results.length,
		data: results,
	};
	next();
};
