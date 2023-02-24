const mongoose = require("mongoose");
const {
	Types: { ObjectId },
} = mongoose;

module.exports.validateObjectId = (id) => {
	try {
		ObjectId.isValid(id) && new ObjectId(id).toString() === id; //true or false
	} catch (error) {
		console.log(error.message);
		return false;
	}
};
