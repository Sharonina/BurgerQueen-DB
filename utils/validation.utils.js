const mongoose = require("mongoose");

const { errorObject } = require("./errors.utils");

const isMongoIdValidation = (idList) => {
  let errorId;
  const isMongoId = idList.every((id) => {
    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      errorId = id;
    }
    return idValid;
  });
  if (!isMongoId) {
    throw errorObject(400, `Invalid id: ${errorId}`);
  }
};

module.exports = { isMongoIdValidation };
