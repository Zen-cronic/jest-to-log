const util = require("node:util")

const LINE_TERMINATOR = "\n";
const WHITESPACE = " ";
const origConsoleLog = console.log.bind(console);

let interceptedOutput = "";
console.log = (firstArg, ...rest) => {
  //1st appch

//   interceptedOutput += firstArg;
//   if (rest.length > 0) {
//     for (const arg of rest) {
//       //   interceptedOutput += WHITESPACE + arg;

//       //NOT LT sol
//       interceptedOutput += WHITESPACE + JSON.stringify(arg);
//     }
//   }
//   interceptedOutput += LINE_TERMINATOR;

  // 2nd
  //   if (typeof firstArg === "object") {
  //     interceptedOutput += JSON.stringify(firstArg);
  //   } else {
  //     interceptedOutput += firstArg;
  //   }

  //   if (rest.length > 0) {
  //     rest.forEach((arg) => {
  //       interceptedOutput += WHITESPACE;
  //       if (typeof arg === "object") {
  //         interceptedOutput += JSON.stringify(arg);
  //       } else {
  //         interceptedOutput += arg;
  //       }
  //     });
  //   }

  //   interceptedOutput += LINE_TERMINATOR;

  //3rd
  interceptedOutput += util.format(firstArg, ...rest) + "\n"
  return origConsoleLog(firstArg, ...rest);
};

function interceptedFn() {
  console.log("Original call");
  console.log("Jello", 1);
  console.log({ 1: 1, 2: [4, 5, 6] }, [1, 2, 3], undefined, null);
}

interceptedFn();

//restore
console.log = origConsoleLog;

//1st
// 'Original call\nJello 1\n[object Object] [1,2,3] undefined null\n'
// console.log({interceptedOutput});

//terminal out: '' => but JSON ""
//2nd
//'Original call\nJello 1\n{"1":1,"2":[4,5,6]} [1,2,3] undefined null\n'

//3rd util.format
//Original call\n
// Jello 1\n
// { '1': 1, '2': [ 4, 5, 6 ] } [ 1, 2, 3 ] undefined null\n
console.log("Intercepted output:");
console.log( interceptedOutput );
