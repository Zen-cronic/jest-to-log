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
      //display the side effects of the orig function 
      return origProcessStdoutWrite(chunk, encoding, cb);
    };

    let logged = "";

    actual();

    process.stdout.write = origProcessStdoutWrite;

    // console.log({ logged });

    const strippedLogged = util.stripVTControlCharacters(logged);
    // console.log({ strippedLogged });

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
    // const origConsoleLog = console.log;

    let logged = "";

    console.log = (message, ...args) => {
      if (args.length === 0) {
        logged += message;
      } else {
        logged += message; // needed to add firstArg if args provided
        for (const arg of args) {
          logged += " " + arg;
        }

        // ? logged += "\n" needed
      }

      logged += "\n";

      // stack overflow err
      //    (return) console.log(message, ...args);

      // RangeError: Maximum call stack size exceeded
      //BUT needed for display in term
      // return origConsoleLog(message, ...args);
      // return origConsoleLog.call(console, message, ...args);
    };

    try {
      process.stdout.write = console.log;

      //this throws RangeError (callstack) too even without the `return origConsoleLog.call(console, message, ...args);`
      // process.stdout.write = origConsoleLog
    } catch (error) {
      console.warn(error);
    }

    //invoke the passed fn
    actual();

    //restore originals
    console.log = origConsoleLog;
    process.stdout.write = origProcessStdoutWrite;

    const strippedLogged = util.stripVTControlCharacters(logged);

    const pass = strippedLogged == expected;

    if (pass) {
      return {
        pass: true,
        // message: () =>
        //   `Expected ${this.utils.printReceived(
        //     strippedLogged
        //   )} not to be ${this.utils.printExpected(expected)}`,
        message: () =>
          `${this.utils.printDiffOrStringify(
            expected,
            strippedLogged,
            `Expected`,
            `Received`,
            true
          )}
            `,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `${this.utils.printDiffOrStringify(
            expected,
            strippedLogged,
            `Expected`,
            `Received`,
            true
          )}
          `,
        // message: () =>
        //   `Expected ${this.utils.printReceived(
        //     strippedLogged
        //   )} to be ${this.utils.printExpected(expected)}`,
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
        "Test logger: *log* -> *Object.actual* -> *__EXTERNAL_MATCHER_TRAP__* -> *Object.toStdoutLog* -> *Promise.then.completed* -> *new Promise* -> *callAsyncCircusFn* -> *_callCircusTest* ->*_runTest* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock*\n" +
          "{\n" +
          '  "testVari": "abc123"\n' +
          "}\n" +
          "\n"
      );
    });
  });

  describe("toConsoleLog", () => {
    it("should intercept console.log", () => {
      function testFn() {
        const testVari = "abc123";
        console.log(testVari);
      }
      expect(testFn).toConsoleLog("abc123" + "\n");
    });
    it("should honor nodejs's process.stdout implm ", () => {
      function testFn() {
        const testVari = "abc123";
        const logger = new Logger("Test logger");

        logger.log({ testVari });
      }

      // Expected "" to be "Test logger: *log* -> ... // cuz jest's console DNUse process.stdout/stderr

      expect(testFn).toConsoleLog(
        "Test logger: *log* -> *Object.actual* -> *__EXTERNAL_MATCHER_TRAP__* -> *Object.toConsoleLog* -> *Promise.then.completed* -> *new Promise* -> *callAsyncCircusFn* -> *_callCircusTest* ->*_runTest* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock*\n" +
          "{\n" +
          '  "testVari": "abc123"\n' +
          "}\n" +
          "\n" +
          "\n"
        //last \n for toConsoleLog interceptor
      );
    });
    it("should allow both console.log and process.stdout.write?", () => {
      function testFn() {
        const testConsoleVari = "xyz456";
        const testVari = "abc123";
        const logger = new Logger("Test logger", {
          entryPoint: "Object.actual",
        });

        console.log(testConsoleVari);
        logger.log(
          { testVari }

          // {
          //   entryPoint: "Object.actual",
          // }
        );
      }

      //received: "xyz456Test logger" BUT should be "xyz456\nTest logger"
      expect(testFn).toConsoleLog(
        "xyz456" +
          "\n" +
          "Test logger: *log*" +
          "\n" +
          "{\n" +
          '  "testVari": "abc123"\n' +
          "}\n" +
          "\n" +
          "\n"
        //last \n for toConsoleLog interceptor
      );

      //   expect(testFn).toConsoleLog(
      //     "xyz456" +
      //       "\n" +
      //       "Test logger: *log* -> *Object.actual* -> *__EXTERNAL_MATCHER_TRAP__* -> *Object.toConsoleLog* -> *Promise.then.completed* -> *new Promise* -> *callAsyncCircusFn* -> *_callCircusTest* ->*_runTest* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> *_runTestsForDescribeBlock* -> \n" +
      //       "{\n" +
      //       '  "testVari": "abc123"\n' +
      //       "}\n" +
      //       "\n" +
      //       "\n"
      //     //last \n for toConsoleLog interceptor
      //   );
    });
  });
});
