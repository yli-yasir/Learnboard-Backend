function handleMongooseError(err,req,res,next){
    if (err.name==="ValidationError"){
    const errors = err.errors;
    const errorMessages = {};
    Object.keys(errors).forEach(key => errorMessages[key] =
        errors[key].message);
    res.status(400).json(errorMessages);
    }
    else{
    next(err);
    }
}

module.exports = {handleMongooseError};