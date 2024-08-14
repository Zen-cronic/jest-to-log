const util = require("util");
const {
  checkLogMatchersArgs,
  EMPTY_STRING,
  invokeFunction,
} = require("../utils");

async function toLogStdoutMatcher(actual, expected) {
  checkLogMatchersArgs(actual, expected);

  const origProcessStdoutWrite = process.stdout.write.bind(process.stdout);

  let loggedMessage = EMPTY_STRING;

  process.stdout.write = function (chunk, encoding, cb) {
    if (typeof chunk == "string") {
      loggedMessage += chunk;
    }
    return origProcessStdoutWrite(chunk, encoding, cb);
  };

  //invoke
  await invokeFunction(actual);

  //restore
  process.stdout.write = origProcessStdoutWrite;

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

module.exports = toLogStdoutMatcher;

expect.extend({
  toLogStdout: toLogStdoutMatcher,
});
