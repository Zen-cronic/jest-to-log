require("../src/index");

const { describe, expect, it } = require("@jest/globals");
const { LINE_TERMINATOR } = require("../src/utils");

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
  describe("toLogStderr", () => {
    it("should honor process.stdout.write", () => {
      function testFn() {
        process.stderr.write(`Jello 123\n`);
        process.stderr.write(`Gello 456\n`);
      }

      const expected =
        "Jello 123" + LINE_TERMINATOR + "Gello 456" + LINE_TERMINATOR;
      expect(testFn).toLogStderr(expected);
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
  describe("handle async functions", () => {
    it("should honor console methods", async () => {
      async function asyncTestFn() {
        await new Promise((resolve) => {
          setTimeout(() => {
            console.log("ASYNC log");
            console.info("ASYNC info");
            console.debug("ASYNC debug");

            console.warn("ASYNC warn");
            console.error("ASYNC error");

            resolve();
          }, 500);
        });
      }

      await expect(asyncTestFn).toLog(
        ["ASYNC log", "ASYNC info", "ASYNC debug"].join(LINE_TERMINATOR) +
          LINE_TERMINATOR
      );
      await expect(asyncTestFn).toLogErrorOrWarn(
        ["ASYNC warn", "ASYNC error"].join(LINE_TERMINATOR) + LINE_TERMINATOR
      );
    });

    it("should honor process write methods", async () => {
      async function asyncTestFn() {
        await new Promise((resolve) => {
          setTimeout(() => {
            process.stdout.write("ASYNC process.stdout.write\n");
            process.stderr.write("ASYNC process.stderr.write\n");

            resolve();
          }, 500);
        });
      }

      await expect(asyncTestFn).toLogStdout(
        "ASYNC process.stdout.write" + LINE_TERMINATOR
      );
      await expect(asyncTestFn).toLogStderr(
        "ASYNC process.stderr.write" + LINE_TERMINATOR
      );
    });
  });
});
