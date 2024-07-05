const { describe, expect, it } = require("@jest/globals");
const util = require("node:util");
const { Logger } = require("scope-logger");

//Expected `received` to be `expected`

function checkLogMatchersArgs(actual, expected) {
  if (typeof actual != "function") {
    throw new TypeError("Must be of type function");
  }

  if (typeof expected != "string") {
    throw new TypeError("Must be of type string");
  }
}

expect.extend({
  toStdoutLog: function (actual, expected) {
    checkLogMatchersArgs(actual, expected);
    const origProcessStdoutWrite = process.stdout.write.bind(process.stdout);

    // console.log(process.stdout.isTTY);

    process.stdout.write = function (chunk, encoding, cb) {
      //   logged += chunk.toString("utf-8");
      if (typeof chunk == "string") {
        logged += chunk;
      }
      return origProcessStdoutWrite(chunk, encoding, cb);
    };

    let logged = "";

    actual();

    process.stdout.write = origProcessStdoutWrite;

    console.log({ logged });

    const strippedLogged = util.stripVTControlCharacters(logged);
    console.log({ strippedLogged });

    const pass = strippedLogged == expected;
    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected ${this.utils.printReceived(
            strippedLogged
          )} not to be ${this.utils.printExpected(expected)}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected ${this.utils.printReceived(
            strippedLogged
          )} to be ${this.utils.printExpected(expected)}`,
      };
    }
  },
  toConsoleLog: function (actual, expected) {
    checkLogMatchersArgs(actual, expected);

    const origProcessStdoutWrite = process.stdout.write.bind(process.stdout);

    const origConsoleLog = console.log.bind(console);

    let logged = "";

    console.log = function (message, ...args) {
      logged += message;
      if (args.length > 0) {
        for (const arg of args) {
          logged += " " + arg;
        }
      }
      //stack overflow err
      //    (return) console.log(message, ...args);
    };
    process.stdout.write = console.log;
    actual();

    //restore originals
    console.log = origConsoleLog;
    process.stdout.write = origProcessStdoutWrite;

    const strippedLogged = util.stripVTControlCharacters(logged);

    const pass = strippedLogged == expected;

    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected ${this.utils.printReceived(
            strippedLogged
          )} not to be ${this.utils.printExpected(expected)}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected ${this.utils.printReceived(
            strippedLogged
          )} to be ${this.utils.printExpected(
            expected
          )}\n${this.utils.printDiffOrStringify(
            expected,
            strippedLogged,
            `Expected`,
            `Received`,
            true
          )}
          `,
      };
    }
  },
});
describe("scope-logger log test", () => {
  describe("toStdoutLog", () => {
    it("should intercept process.stdout", () => {
      function testFn() {
        const testVari = "abc123";
        const logger = new Logger("Test logger");

        logger.log({ testVari });
      }
      expect(testFn).toStdoutLog(
        "Test logger: *log* -> *Object.actual* -> *__EXTERNAL_MATCHER_TRAP__* -> *Object.toStdoutLog* -> *Promise.then.completed* -> *new Promise* -> *callAsyncCircusFn* -> *_callCircusTest* ->*_runTest* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> \n" +
          "{\n" +
          '  "testVari": "abc123"\n' +
          "}\n" +
          "\n"
      );
    });
  });

  describe("toConsoleLog", () => {
    it("should honor nodejs's process.stdout implm ", () => {
      function testFn() {
        const testVari = "abc123";
        const logger = new Logger("Test logger");

        logger.log({ testVari });
      }

      // Expected "" to be "Test logger: *log* -> ... // cuz jest's console DNUse process.stdout/stderr

      expect(testFn).toConsoleLog(
        "Test logger: *log* -> *Object.actual* -> *__EXTERNAL_MATCHER_TRAP__* -> *Object.toConsoleLog* -> *Promise.then.completed* -> *new Promise* -> *callAsyncCircusFn* -> *_callCircusTest* ->*_runTest* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> \n" +
          "{\n" +
          '  "testVari": "abc123"\n' +
          "}\n" +
          ""
      );
    });
  });
});
