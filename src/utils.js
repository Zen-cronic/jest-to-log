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

module.exports = {
  EMPTY_STRING,
  LINE_TERMINATOR,
  checkLogMatchersArgs,
  getClassName,
  isAsyncFunction,
  invokeFunction
};
