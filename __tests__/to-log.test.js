const { describe, expect, it, jest } = require("@jest/globals");
const util = require("node:util");

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
  },
  toLogStdout: function (actual, expected) {
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

          //   return `Expected ${this.utils.printReceived(
          //     loggedMessage
          //   )} not to be ${this.utils.printExpected(expected)}`;
        },
      };
    }
  },
  toLogErrorOrWarn: function (actual, expected) {
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
  },
});

describe("extended matchers", () => {
  describe("toLog", () => {
    describe("console.log", () => {
      it("should honor console.log", () => {
        function testFn() {
          console.log("Jello", 1);
          console.log("Jello", 2);
        }

        const expectedString =
          "Jello 1" + LINE_TERMINATOR + "Jello 2" + LINE_TERMINATOR;

        expect(testFn).toLog(expectedString);
      });

      it("should log objects and arrays in the correct format", () => {
        function testFn() {
          console.log({}, []); // {} []\n
          console.log([], {}); // [] {}\n
          console.log({ 1: 1, 2: [3, 4, 5] }, [100, 200, 300], undefined, null);
        }

        const expectedString =
          "{} []" +
          LINE_TERMINATOR +
          "[] {}" +
          LINE_TERMINATOR +
          "{ '1': 1, '2': [ 3, 4, 5 ] } [ 100, 200, 300 ] undefined null" +
          LINE_TERMINATOR;
        expect(testFn).toLog(expectedString);
      });
      it("testing diff format", () => {
        // -  A B C
        // + ABC
        const expected = " A B C \n";
        const result = "ABC ";
        expect(result).not.toBe(expected);
      });
    });

    describe("console.info", () => {
      it("should honor console.info solely", () => {
        function testFn() {
          console.info("Tello", 100);
          console.info("Tello", 200);
        }

        const expectedString =
          "Tello 100" + LINE_TERMINATOR + "Tello 200" + LINE_TERMINATOR;

        expect(testFn).toLog(expectedString);
      });
      it("should honor console.info in combo with console.log", () => {
        function testFn() {
          console.info("Vello", 300);
          console.log("Vello", 400);
          console.info(
            { 1: 1, 2: [3, 4, 5] },
            [100, 200, 300],
            undefined,
            null
          );
        }

        //   const expectedString =
        //     ["Vello 300", "Vello 400", "Vello 500"].join(LINE_TERMINATOR) +
        //     LINE_TERMINATOR;
        const expectedString =
          "Vello 300" +
          LINE_TERMINATOR +
          "Vello 400" +
          LINE_TERMINATOR +
          "{ '1': 1, '2': [ 3, 4, 5 ] } [ 100, 200, 300 ] undefined null" +
          LINE_TERMINATOR;

        expect(testFn).toLog(expectedString);
      });
    });
    describe("console.debug", () => {
      it("should honor console.debug solely", () => {
        function testFn() {
          console.debug("Mello", 100);
          console.debug("Mello", 200);
        }

        const expectedString =
          "Mello 100" + LINE_TERMINATOR + "Mello 200" + LINE_TERMINATOR;

        expect(testFn).toLog(expectedString);
      });
      it("should honor console.debug in combo with console.log", () => {
        function testFn() {
          console.debug("Cello", 300);
          console.log("Cello", 400);
          console.debug(
            { 1: 1, 2: [3, 4, 5] },
            [100, 200, 300],
            undefined,
            null
          );
        }

        const expectedString =
          "Cello 300" +
          LINE_TERMINATOR +
          "Cello 400" +
          LINE_TERMINATOR +
          "{ '1': 1, '2': [ 3, 4, 5 ] } [ 100, 200, 300 ] undefined null" +
          LINE_TERMINATOR;

        expect(testFn).toLog(expectedString);
      });
    });
  });
  describe("toLogStdout", () => {
    it("should honor process.stdout.write", () => {
      function testFn() {
        //1st line depends on 'verbose': 2 or 4 indents

        // +   console.log
        // +     Jello log
        // +
        // +       at log (__tests__/to-log.test.js:261:17)
        // +
        // console.log("Jello log");
        process.stdout.write(`Jello 123\n`);
        process.stdout.write(`Gello 456\n`);
      }

      const expected =
        "Jello 123" + LINE_TERMINATOR + "Gello 456" + LINE_TERMINATOR;
      expect(testFn).toLogStdout(expected);
    });
  });
  describe("toLogErrorOrWarn", () => {
    describe("console.error", () => {
      it("should honor console.error solely", () => {
        function testFn() {
          console.error("Jello error");
          console.error(new Error("Gello error").message);
        }

        const expected =
          "Jello error" + LINE_TERMINATOR + "Gello error" + LINE_TERMINATOR;

        expect(testFn).toLogErrorOrWarn(expected);
      });
    });
    describe("console.warn", () => {
      it("should honor console.warn solely", () => {
        function testFn() {
          console.warn("Jello warning");
          console.warn("Gello warning");
        }

        const expected =
          "Jello warning" + LINE_TERMINATOR + "Gello warning" + LINE_TERMINATOR;

        expect(testFn).toLogErrorOrWarn(expected);
      });
    });

    describe("combination of console.error and console.warn", () => {
      it("should honor both methods", () => {
        function testFn() {
          console.warn("Jello warning");
          console.error("Gello error");
          console.warn("Jello 123");
          console.error("Gello 123");
        }

        const expected =
          "Jello warning" +
          LINE_TERMINATOR +
          "Gello error" +
          LINE_TERMINATOR +
          "Jello 123" +
          LINE_TERMINATOR +
          "Gello 123" +
          LINE_TERMINATOR;

        expect(testFn).toLogErrorOrWarn(expected);
      });

      it("should not honor other methods", () => {
        function testFn() {
          console.warn("Jello warning");
          console.error("Gello error");
          console.log("Jello 123");
        }

        const correctExpected =
          "Jello warning" + LINE_TERMINATOR + "Gello error" + LINE_TERMINATOR;

        const wrongExpected = correctExpected + "Jello 123" + LINE_TERMINATOR;

        expect(testFn).not.toLogErrorOrWarn(wrongExpected);
        expect(testFn).toLogErrorOrWarn(correctExpected);
      });
      // it("should process.stderr.write", () => {

      // process.stderr.write() args omitted cuz nu intercept
      //   function testFn() {
      //     console.error("Jello error");
      //     process.stderr.write("Process Gello error" + "\n");
      //   }

      //   const expected =
      //     "Jello error" +
      //     LINE_TERMINATOR +
      //     "Process Gello error" +
      //     LINE_TERMINATOR;

      //   expect(testFn).toLogErrorOrWarn(expected);
      // });
    });
  });
});
