const Bootcamp = require("../models/Bootcamp.js");
const { validateObjectId } = require("../helpers/validate.js");

// @desc		return all Bootcamps
// @route		GET /bootcamps
const getAllBootcamps = async (req, res) => {
	try {
		const bootcamps = await Bootcamp.find();

		return res.status(200).json({
			success: true,
			count: bootcamps.length,
			data: bootcamps,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
		});
	}
};

// @desc		return a single Bootcamp
// @route		GET /bootcamps/:id
const getSingleBootcamp = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id && !validateObjectId(id))
			throw new Error("Bootcamp's id not valid");

		const bootcamp = await Bootcamp.findById(id);

		if (!bootcamp)
			return res.status(404).json({
				success: false,
				message: "Bootcamp Not Founded",
			});

		return res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: "Please enter a valid Bootcamp's id",
		});
	}
};

// @desc		create new Bootcamp
// @route		POST /bootcamps
const createBootcamp = async (req, res) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

// @desc		update Bootcamp
// @route		PATCH /bootcamps/:id
const updateBootcamp = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id && !validateObjectId(id))
			throw new Error("Bootcamp's id not valid");

		const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!bootcamp)
			return res.status(404).json({
				success: false,
				message: "Bootcamp not founded",
			});

		return res.status(200).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: "Bootcamp's id not valid",
		});
	}
};

// @desc		delete Bootcamp
// @route		DELETE /bootcamps/:id
const deleteBootcamp = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id && !validateObjectId(id))
			throw new Error("Bootcamp's id not valid");

		const bootcamp = await Bootcamp.findByIdAndDelete(id);

		if (!bootcamp)
			return res.status(404).json({
				success: false,
				message: "Bootcamp not founded",
			});

		return res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: "Bootcamp's id not valid",
		});
	}
};

module.exports = {
	getAllBootcamps,
	getSingleBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
};
