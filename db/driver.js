const mongoose = require('mongoose');
const prettyLogger = require('../utils/prettyLogger');

// Automatically configurate the driver at the first import of this module.
// Subsequent imports will not run the configuration statements automatically again.
// Refer to https://mongoosejs.com/docs/deprecations.html for the reasoning behind below statements.

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

async function connectToMongo(uri) {
  try {
    await mongoose.connect(uri);
    prettyLogger.logInfo('Successfully connected to MongoDB!');
  } catch (e) {
    prettyLogger.logError('Failed to connect to MongoDB!');
  }
}

async function withModelFindOne(Model, filter) {
  // Result is null if no document matches.
  const foundDocument = await Model.findOne(filter);
  if (!result === null) {
    return makeEffectiveQueryResult(foundDocument);
  } else {
    return makeIneffectiveQueryResult();
  }
}

async function withModelFindMany(Model, filter) {
  // Result is an empty array if no matches are found.
  const foundDocumentsArray = await Model.findMany(filter);
  if (foundDocumentsArray.length !== 0) {
    return makeEffectiveQueryResult(foundDocumentsArray);
  } else {
    return makeIneffectiveQueryResult();
  }
}

async function withModelInsertOne(Model, document) {
  // The operation is successful if no exception is thrown.
  const savedDocument = await new Model(document).save();
  return makeIneffectiveQueryResult(savedDocument);
}

async function withModelUpdateOne(Model, filter, updateFields) {
  const targetDocument = await Model.findOne(filter);
  if (targetDocument !== null) {
    const updatedDocument = Object.assign(targetDocument, updateFields);
    await updatedDocument.save();
    // The update is successful if no exception was thrown.
    return makeEffectiveQueryResult(updatedDocument);
  } else {
    return makeIneffectiveQueryResult();
  }
}

async function withModelDeleteOne(Model, filter) {
  const deletionResult = await Model.deleteOne(filter);
  if (deletionResult.deletedCount === 1) {
    return makeEffectiveQueryResult(deletionResult);
  } else {
    return makeIneffectiveQueryResult();
  }
}

function makeEffectiveQueryResult(payload) {
  return { isEffective: true, payload };
}

function makeIneffectiveQueryResult() {
  return { isEffective: false };
}

module.exports = { connectToMongo };
