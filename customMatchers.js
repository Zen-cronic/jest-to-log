
function toBeWithinRange(actual, floor, ceiling) {
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
}

module.exports = {
    toBeWithinRange
};
