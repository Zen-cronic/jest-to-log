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
    const origConsoleInfo = console.info.bind(console);
    const origConsoleDebug = console.debug.bind(console);

    let loggedMessage = EMPTY_STRING;
    console.log = (firstArg, ...rest) => {
      loggedMessage += firstArg;
      //   loggedMessage += JSON.stringify(firstArg);

      //   console.log({}, []); //{} []\n
      //   console.log([], {}); //[] {}\n
      if (rest.length > 0) {
        for (const arg of rest) {
          //   if (arg.toString() !== "") {
          //     loggedMessage += WHITESPACE + arg;
          //   } else {
          //     loggedMessage += arg;
          //   }
          // loggedMessage += WHITESPACE + arg;

          //NOT LT sol
          loggedMessage += WHITESPACE + JSON.stringify(arg);
        }
      }
      loggedMessage += LINE_TERMINATOR;

      //   console.log
      //   Jello 1
      //
      //     at console.origConsoleLog [as log] (__tests__/to-log.test.js:35:14)
      //
      // + more
      return origConsoleLog(firstArg, ...rest);
    };

    //work cuz only an alias, .info DNCall .log unlike process.stdout.write
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
});

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

    it("should log obj", () => {
      function testFn() {
        console.log({}, []); // {} []\n
        console.log([], {}); // [] {}\n
      }

      // "[object Object] " +
      //   LINE_TERMINATOR +
      //   " [object Object]" +
      //   LINE_TERMINATOR;
      const expectedString =
        "{} []" + LINE_TERMINATOR + "[] {}" + LINE_TERMINATOR;
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
        console.info("Vello", 500);
      }

      //   const expectedString =
      //     ["Vello 300", "Vello 400", "Vello 500"].join(LINE_TERMINATOR) +
      //     LINE_TERMINATOR;
      const expectedString =
        "Vello 300" +
        LINE_TERMINATOR +
        "Vello 400" +
        LINE_TERMINATOR +
        "Vello 500" +
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
        console.debug("Cello", 500);
      }

      const expectedString =
        "Cello 300" +
        LINE_TERMINATOR +
        "Cello 400" +
        LINE_TERMINATOR +
        "Cello 500" +
        LINE_TERMINATOR;

      expect(testFn).toLog(expectedString);
    });
  });
});
