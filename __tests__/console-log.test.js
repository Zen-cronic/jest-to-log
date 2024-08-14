// https://dev.to/zirkelc/how-to-test-console-log-5fhd

const {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest: jestGlobal,
} = require("@jest/globals");

describe.skip("Test console", () => {
  describe("console.log", () => {
    let logSpy = null;
    let infoSpy = null;
    function testFn() {
      console.log("Cabbage");
      console.log("Carrot");
    }

    beforeEach(() => {
      logSpy = jestGlobal.spyOn(global.console, "log");

      infoSpy = jestGlobal.spyOn(global.console, "info");
    });

    afterEach(() => {
      logSpy.mockRestore(); //or as an option
      infoSpy.mockRestore();
    });

    it("should call console logs", () => {
      testFn();

      expect(logSpy).toHaveBeenCalledTimes(2);

      expect(logSpy).toHaveBeenCalledWith("Cabbage");

      expect(logSpy.mock.calls).toContainEqual(["Carrot"]);
    });
    it("should not honor alias console.info", () => {
      testFn();
      expect(infoSpy).not.toHaveBeenCalled();
    });
  });

  describe("process.stdout", () => {
    let stdoutWriteSpy = null;

    beforeEach(() => {
      stdoutWriteSpy = jestGlobal.spyOn(process.stdout, "write");
    });

    afterEach(() => {
      stdoutWriteSpy.mockRestore(); //or as an option
    });
    it("should call process.stdout.write", () => {
      function stdoutTestFn() {
        process.stdout.write("Beetroot" + "\n");
        process.stdout.write("Lettuce" + "\n");
      }
      stdoutTestFn();

      expect(stdoutWriteSpy).toHaveBeenCalledTimes(2);
      expect(stdoutWriteSpy).toHaveBeenCalledWith("Lettuce\n");

      expect(stdoutWriteSpy.mock.calls).toContainEqual(["Beetroot\n"]);
    });

    it("should not honor nodejs console.log's process.stdout implm", () => {
      function logTestFn() {
        console.log("Beetroot");
        console.log("Lettuce");
      }
      logTestFn();

      expect(stdoutWriteSpy).toHaveBeenCalledTimes(2); //passes

      expect(stdoutWriteSpy).not.toHaveBeenLastCalledWith("Lettuce\n");
      expect(stdoutWriteSpy).not.toHaveBeenCalledWith("Lettuce\n");

      expect(stdoutWriteSpy.mock.calls).not.toContainEqual(["Beetroot\n"]);

      //following fails cuz custom console implm
      //https://github.com/jestGlobaljs/jestGlobal/issues/9984

      //     1: "  console.log
      //     Beetroot

      //       at log (__tests__/console-log.test.js:74:17)·
      // ", [Function anonymous]
      // ->     2: "  console.log
      //     Lettuce

      //       at log (__tests__/console-log.test.js:75:17)·
      // ", [Function anonymous]
      // expect(stdoutWriteSpy).toHaveBeenLastCalledWith("Lettuce\n")
      //   expect(stdoutWriteSpy).toHaveBeenLastCalledWith(`  console.log\nBeetroot

      //       at log (__tests__/console-log.test.js:74:17)·
      // ", [Function anonymous]
      // ->     2: "  console.log
      //     Lettuce

      //       at log (__tests__/console-log.test.js:75:17)·
      // ", [Function anonymous]"`);

      // expect(stdoutWriteSpy).toHaveBeenCalledWith("Lettuce\n");
    });
  });

  // describe("Testing output of console.log in jestGlobal", () => {
  //   it("should log {} and [] as is", () => {
  //     console.log("Testing output");
  //     console.log({}, []);
  //     console.log([], {});

  //     //
  //     // console.log
  //     //   {} []

  //     //     at Object.log (__tests__/console-log.test.js:118:15)

  //     // console.log
  //     //   [] {}

  //     //     at Object.log (__tests__/console-log.test.js:119:15)

  //     expect(true).toBe(true);
  //   });
  // });
});
