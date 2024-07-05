// https://dev.to/zirkelc/improve-your-testing-with-custom-matchers-in-jest-2ibm

const { describe, expect, it } = require("@jest/globals");

expect.extend({
  toBeWithinRange: function (actual, floor, ceiling) {
    if ([actual, floor, ceiling].some((arg) => typeof arg != "number")) {
      throw new TypeError("These must be of type number!");
    }

    const pass = actual >= floor && actual <= ceiling;

    if (pass) {
      return {
        pass: true,
        message: () =>
          `expected ${this.utils.printReceived(
            actual
          )} not to be within range ${this.utils.printExpected(
            `${floor} - ${ceiling}`
          )}`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `expected ${this.utils.printReceived(
            actual
          )} to be within range ${this.utils.printExpected(
            `${floor} - ${ceiling}`
          )}`,
      };
    }
  },
});

describe("Custom matchers", () => {
  it("should work", () => {
    //expect(1).toBe(1)
    expect(1).toBeWithinRange(0, 2);
  });
  // it("should try toLog", () => {
  //   //     //    Expected "  console.log
  //   //     Jello

  //   //     at log (test.js:87:27)·
  //   // " to be "Jello"

  //   //works only with console.log intercept
  //   expect(() => {
  //   //   console.log("Jello", 1);
  //   }).toLog("Jello 1");

  //   //works only with process.stdout.write intercept
  //   // expect(() => {
  //   //     process.stdout.write("Jello\n")
  //   // }).toLog("Jello")
  // });
});
