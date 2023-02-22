const getAllBootcamps = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			data: "Get all bootcamps",
		});
	} catch (error) {
		throw new Error(error);
	}
};

const getSingleBootcamp = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			data: `get single bootcamp num. ${req.params.id}`,
		});
	} catch (error) {
		throw new Error(error);
	}
};

const createBootcamp = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			data: "create new bootcamp",
		});
	} catch (error) {
		throw new Error(error);
	}
};

const updateBootcamp = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			data: `update bootcamp num. ${req.params.id}`,
		});
	} catch (error) {
		throw new Error(error);
	}
};

const deleteBootcamp = async (req, res) => {
	try {
		res.status(200).json({
			success: true,
			data: `delete bootcamp num. ${req.params.id}`,
		});
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {
	getAllBootcamps,
	getSingleBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
};
