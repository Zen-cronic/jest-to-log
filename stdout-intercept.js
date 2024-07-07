const util = require("util");
const LINE_TERMINATOR = "\n";
const WHITESPACE = " ";
const origProcessStdoutWrite = process.stdout.write.bind(process.stdout);

let interceptedOutput = "";
process.stdout.write = (chunk, encoding, cb) => {
  if (typeof chunk == "string") {
    interceptedOutput += chunk;
  }
  return origProcessStdoutWrite(chunk, encoding, cb)
};

function interceptedFn() {
  const arr = [];
  const obj = {};
  console.log("Original call");
  //when arr/obj strinfigied in template literal, toString() called
  //'Process stdout write call: [object Object] Jello\n'
  process.stdout.write(`Process stdout write call: ${arr}${obj} Jello\n`);
  console.log({ 1: 1, 2: [4, 5, 6] }, [1, 2, 3], undefined, null);
  const promise = new Promise((resolve, reject) => {
    try {
        resolve()
    } catch (error) {
        reject(error)
    }
  })
  //Promise { undefined }
  console.log(promise);
}

interceptedFn();
interceptedOutput = util.stripVTControlCharacters(interceptedOutput);

//restore
process.stdout.write = origProcessStdoutWrite;

//terminal out: '' => but JSON ""
//'Original call\nJello 1\n{"1":1,"2":[4,5,6]} [1,2,3] undefined null\n'
console.log(interceptedOutput );

console.warn("Jelo");
console.error("Jelo");

