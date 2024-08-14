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

function getClassName(o) {
  return Object.prototype.toString.call(o);
}

function isAsyncFunction(fn) {
  return getClassName(fn) === "[object AsyncFunction]";
}

async function invokeFunction(fn) {
  if (isAsyncFunction(fn)) {
    await fn();
  } else {
    fn();
  }
}

/**
 * Concatenates separator to the right of `Array.join(separator)`
 * @param {Array} arr
 * @param {string} [separator] - If not `string` or `undefined`, implicitly coerced to a string
 * @returns {string}
 */
function joinRight(arr, separator) {
  if (!Array.isArray(arr)) {
    throw new TypeError(
      `Must be of type Array; Received: ${getClassName(arr)}`
    );
  }

  return arr.join(separator) + (separator === undefined ? "," : separator);
}

module.exports = {
  EMPTY_STRING,
  LINE_TERMINATOR,
  checkLogMatchersArgs,
  getClassName,
  isAsyncFunction,
  invokeFunction,
  joinRight,
};
