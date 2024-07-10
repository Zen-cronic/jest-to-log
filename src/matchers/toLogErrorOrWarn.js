const util = require("util");
const { checkLogMatchersArgs, EMPTY_STRING } = require("../utils");

function toLogErrorOrWarnMatcher(actual, expected) {
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
  actual();

  //restore
  console.error = origConsoleError;
  console.warn = origConsoleWarn;

  //ansi applied only after invoked, so cleaning nu need
  const cleanedMessage = util.stripVTControlCharacters(loggedMessage);
  // const cleanedMessage = loggedMessage;

  const pass = cleanedMessage === expected;

  if (pass) {
    return {
      pass: true,
      message: () => {
        return `${this.utils.printDiffOrStringify(
          expected,
          cleanedMessage,
          `Expected`,
          `Received`,
          true
        )} `;
      },
    };
  } else {
    return {
      pass: false,
      message: () => {
        return `${this.utils.printDiffOrStringify(
          expected,
          cleanedMessage,
          `Expected`,
          `Received`,
          true
        )} `;
      },
    };
  }
}

module.exports = toLogErrorOrWarnMatcher;

expect.extend({
  toLogErrorOrWarn: toLogErrorOrWarnMatcher,
});
