function getErrorMessages(mongooseError){
    const errors = mongooseError.errors;
    const errorMessages = {};
    Object.keys(errors).forEach(key => errorMessages[key] =
        errors[key].message);
    return errorMessages;

}

module.exports = {getErrorMessages};