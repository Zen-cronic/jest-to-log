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

module.exports = {
    EMPTY_STRING, LINE_TERMINATOR, checkLogMatchersArgs
};
