const mongoose = require("mongoose");

const { errorObject } = require("./errors.utils");

const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw errorObject(400, `Invalid id: ${id}`);
  }
  return mongoose.Types.ObjectId(id);
};

module.exports = { toObjectId };
