const { describe, expect, it } = require("@jest/globals");
const util = require("node:util");

const WHITESPACE = " ";
const EMPTY_STRING = "";
const LINE_TERMINATOR = "\n";

function checkLogMatchersArgs(actual, expected) {
  if (typeof actual != "function") {
    throw new TypeError("Must be of type function");
  }

  if (typeof expected != "string") {
    throw new TypeError("Must be of type string");
  }
}

expect.extend({
  toLog: function (actual, expected) {
    checkLogMatchersArgs(actual, expected);

    const origConsoleLog = console.log.bind(console);

    let loggedMessage = EMPTY_STRING;
    console.log = (firstArg, ...rest) => {
      if (rest.length === 0) {
        loggedMessage += firstArg;
      } else {
        for (const arg of rest) {
          loggedMessage += WHITESPACE + arg;
        }
      }
      loggedMessage += LINE_TERMINATOR;

      //return origConsoleLog(firstArg, ...rest)
    };

    //invoke
    actual();

    //restore
    console.log = origConsoleLog;

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
  },
});

describe("toLog", () => {
  describe("console.log", () => {
    it("should", () => {
      function testFn() {
        console.log("Jello", 1);
        console.log("Jello", 2);
      }

      const expectedString =
        "Jello 1" + LINE_TERMINATOR + "Jello 2" + LINE_TERMINATOR;

      expect(testFn).toLog(expectedString);
    });
  });
});
