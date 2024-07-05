const { describe, expect, it } = require("@jest/globals");

function checkLogMatchersArgs(actual, expected) {
  if (typeof actual != "function") {
    throw new TypeError("Must be of type function");
  }

  if (typeof expected != "string") {
    throw new TypeError("Must be of type string");
  }
}
expect.extend({
  toConsoleLog: function (actual, expected) {
    checkLogMatchersArgs(actual, expected);
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
    actual();
    console.log = origConsoleLog;

    const pass = logged == expected;

    console.log({ logged });
    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected ${this.utils.printReceived(
            logged
          )} not to be ${this.utils.printExpected(expected)}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected ${this.utils.printReceived(
            logged
          )} to be ${this.utils.printExpected(expected)}`,
      };
    }
  },
  toConsoleInfo: function (actual, expected) {
    checkLogMatchersArgs(actual, expected);
    const origConsoleInfo = console.info.bind(console);
    const origConsoleLog = console.log.bind(console);

    let logged = "";

    console.info = function (message, ...args) {
      logged += message;
      if (args.length > 0) {
        for (const arg of args) {
          logged += " " + arg;
        }
      }
      //stack overflow err
      //    (return) console.log(message, ...args);
    };
    console.log = console.info;

    actual();
    console.info = origConsoleInfo;
    console.log = origConsoleLog;

    const pass = logged == expected;

    console.log({ logged });
    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected ${this.utils.printReceived(
            logged
          )} not to be ${this.utils.printExpected(expected)}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected ${this.utils.printReceived(
            logged
          )} to be ${this.utils.printExpected(expected)}`,
      };
    }
  },
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

    const pass = logged == expected;

    console.log({ logged });
    if (pass) {
      return {
        pass: true,
        message: () =>
          `Expected ${this.utils.printReceived(
            logged
          )} not to be ${this.utils.printExpected(expected)}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected ${this.utils.printReceived(
            logged
          )} to be ${this.utils.printExpected(expected)}`,
      };
    }
  },
});

describe("console and process", () => {
  describe("toConsoleLog", () => {
    it("should pass toConsoleLog", () => {
      //Output when used with process.stdout intercept instead:
      //  Expected "  console.log
      //     Jello

      //     at log (test.js:87:27)·
      // " to be "Jello"

      //works only with console.log intercept
      expect(() => {
        console.log("Jello", 1);
      }).toConsoleLog("Jello 1");
    });
  });

  describe("toConsoleInfo", () => {
    it("should pass toConsoleInfo", () => {
      expect(() => {
        console.info("Jello", "info");
      }).toConsoleInfo("Jello info");

      expect(() => {
        console.info("Jello", "info");
      }).not.toConsoleInfo("abc123");
    });
    it('should pass toConsoleInfo with console.log', () => {
        expect(() => {
            console.log("Jello", "info");
          }).toConsoleInfo("Jello info");
    
          expect(() => {
            console.log("Jello", "info");
          }).not.toConsoleInfo("abc123");
    });
  });

  describe("toStdoutLog", () => {
    it("should try process.stdout", () => {
      //works only with process.stdout.write intercept
      expect(() => {
        process.stdout.write("Jello\n");
      }).toStdoutLog("Jello\n");
    });
  });
});
