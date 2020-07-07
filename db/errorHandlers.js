
// TODO
function handleValidationError(err,req,res,next){

    if (err.name==="ValidationError"){
    console.log('mongoose validation error')
    // const errorsObj = err.errors;
    // const errorMessages = {};
    // Object.keys(errors).forEach(key => errorMessages[key] =
    //     errors[key].message);
    // res.status(400).json(errorMessages);
    }
    else{
    next(err);
    }
}


module.exports = {dbErrorHandlers: [handleValidationError]}