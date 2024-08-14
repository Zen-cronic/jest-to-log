const util = require("util");
const {
  checkLogMatchersArgs,
  EMPTY_STRING,
  invokeFunction,
} = require("../utils");

async function toLogErrorOrWarnMatcher(actual, expected) {
  checkLogMatchersArgs(actual, expected);

  const origConsoleError = console.error.bind(console);
  const origConsoleWarn = console.error.bind(console);

  let loggedMessage = EMPTY_STRING;

  //intercept console.error
  console.error = (firstArg, ...rest) => {
    loggedMessage += util.format(firstArg, ...rest) + "\n";
    return origConsoleError(firstArg, ...rest);
  };

  console.warn = console.error;

  //invoke
  await invokeFunction(actual);

  //restore
  console.error = origConsoleError;
  console.warn = origConsoleWarn;

  const cleanedMessage = util.stripVTControlCharacters(loggedMessage);

  const pass = cleanedMessage === expected;

  const messageFn = () => {
    return `${this.utils.printDiffOrStringify(
      expected,
      cleanedMessage,
      `Expected`,
      `Received`,
      true
    )} `;
  };
  if (pass) {
    return {
      pass: true,
      message: messageFn,
    };
  } else {
    return {
      pass: false,
      message: messageFn,
    };
  }
}

module.exports = toLogErrorOrWarnMatcher;

expect.extend({
  toLogErrorOrWarn: toLogErrorOrWarnMatcher,
});
