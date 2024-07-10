const util = require("util");
const { checkLogMatchersArgs, EMPTY_STRING } = require("../utils");

function toLogMatcher(actual, expected) {
  checkLogMatchersArgs(actual, expected);

  const origConsoleLog = console.log.bind(console);
  const origConsoleInfo = console.info.bind(console);
  const origConsoleDebug = console.debug.bind(console);

  let loggedMessage = EMPTY_STRING;

  //intercept console.log
  console.log = (firstArg, ...rest) => {
    loggedMessage += util.format(firstArg, ...rest) + "\n";
    return origConsoleLog(firstArg, ...rest);
    // return;
  };

  //work cuz only an alias, .info DNCall .log unlike .log calling process.stdout.write
  //Console.prototype.info = . .log
  //Console.prototype.debug = . .log
  console.info = console.log;
  console.debug = console.log;

  //invoke
  actual();

  //restore
  console.log = origConsoleLog;
  console.info = origConsoleInfo;
  console.debug = origConsoleDebug;

  const cleanedMessage = util.stripVTControlCharacters(loggedMessage);

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

        //   return `Expected ${this.utils.printReceived(
        //     loggedMessage
        //   )} not to be ${this.utils.printExpected(expected)}`;
      },
    };
  }
}

module.exports = toLogMatcher;

expect.extend({
  toLog: toLogMatcher,
});
