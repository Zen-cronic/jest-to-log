const util = require("util");
const {
  checkLogMatchersArgs,
  EMPTY_STRING,
  invokeFunction,
} = require("../utils");

async function toLogMatcher(actual, expected) {
  checkLogMatchersArgs(actual, expected);

  const origConsoleLog = console.log.bind(console);
  const origConsoleInfo = console.info.bind(console);
  const origConsoleDebug = console.debug.bind(console);

  let loggedMessage = EMPTY_STRING;

  //intercept console.log
  console.log = (firstArg, ...rest) => {
    loggedMessage += util.format(firstArg, ...rest) + "\n";
    return origConsoleLog(firstArg, ...rest);
  };

  console.info = console.log;
  console.debug = console.log;

  //invoke
  await invokeFunction(actual);

  //restore
  console.log = origConsoleLog;
  console.info = origConsoleInfo;
  console.debug = origConsoleDebug;

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

module.exports = toLogMatcher;

expect.extend({
  toLog: toLogMatcher,
});
