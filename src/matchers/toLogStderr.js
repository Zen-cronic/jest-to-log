const util = require("util");
const {
  checkLogMatchersArgs,
  EMPTY_STRING,
  invokeFunction,
} = require("../utils");

async function toLogStderrMatcher(actual, expected) {
  checkLogMatchersArgs(actual, expected);

  const origProcessStderrWrite = process.stderr.write.bind(process.stderr);

  let loggedMessage = EMPTY_STRING;

  process.stderr.write = function (chunk, encoding, cb) {
    if (typeof chunk == "string") {
      loggedMessage += chunk;
    }
    return origProcessStderrWrite(chunk, encoding, cb);
  };

  //invoke
  await invokeFunction(actual);

  //restore
  process.stderr.write = origProcessStderrWrite;

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

module.exports = toLogStderrMatcher;

expect.extend({
  toLogStderr: toLogStderrMatcher,
});
