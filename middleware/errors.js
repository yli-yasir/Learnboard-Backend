function handleMongooseError(err,req,res,next){
    console.log('my logger')
    // const errors = mongooseError.errors;
    // const errorMessages = {};
    // Object.keys(errors).forEach(key => errorMessages[key] =
    //     errors[key].message);
    // return errorMessages;
}

module.exports = {handleMongooseError};