// https://dev.to/zirkelc/how-to-test-console-log-5fhd

const {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest,
} = require("@jest/globals");

describe("Test console", () => {
  describe("console.log", () => {
    let logSpy = null;
    let infoSpy = null;
    function testFn() {
      console.log("Cabbage");
      console.log("Carrot");
    }

    beforeEach(() => {
      logSpy = jest.spyOn(global.console, "log");
      // .mockImplementation(() => {}) //
      //.mockImplm equilvalent to jest.fn(implm()) //e.g., the functionaliyt of log stubbed with noop

      infoSpy = jest.spyOn(global.console, "info");
    });

    afterEach(() => {
      logSpy.mockRestore(); //or as an option
      infoSpy.mockRestore();
    });

    it("should call console logs", () => {
      testFn();

      expect(logSpy).toHaveBeenCalledTimes(2);
      // expect(logSpy)
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
      stdoutWriteSpy = jest.spyOn(process.stdout, "write");
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
      //https://github.com/jestjs/jest/issues/9984
      //   expect(stdoutWriteSpy).toHaveBeenLastCalledWith("Lettuce\n")
      //   expect(stdoutWriteSpy).toHaveBeenCalledWith("Lettuce\n");

      //   expect(stdoutWriteSpy.mock.calls).toContainEqual(["Beetroot\n"]);
    });
  });
});
