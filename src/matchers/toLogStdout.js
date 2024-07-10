const util = require("util");
const { checkLogMatchersArgs, EMPTY_STRING } = require("../utils");

function toLogStdoutMatcher(actual, expected) {
  checkLogMatchersArgs(actual, expected);

  const origProcessStdoutWrite = process.stdout.write.bind(process.stdout);

  let loggedMessage = EMPTY_STRING;

  process.stdout.write = function (chunk, encoding, cb) {
    if (typeof chunk == "string") {
      loggedMessage += chunk;
    }
    //display the side effects of the orig function
    return origProcessStdoutWrite(chunk, encoding, cb);
  };

  //invoke
  actual();

  //restore
  process.stdout.write = origProcessStdoutWrite;

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
      },
    };
  }
}

module.exports = toLogStdoutMatcher;

expect.extend({
  toLogStdout: toLogStdoutMatcher,
});
