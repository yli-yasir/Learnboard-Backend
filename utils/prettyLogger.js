const chalk = require("chalk");

const prettyLogger = {}

prettyLogger.logError = (msg) => {
    console.error(chalk.red(msg));
}

prettyLogger.logWarning = (msg) => {
    console.log(chalk.yellow(msg));
}

prettyLogger.logInfo = (msg) => {
    console.log(chalk.blueBright(msg));
}

prettyLogger.logDebug = (msg) => {
    console.log(chalk.green(msg));
}

module.exports = prettyLogger;
