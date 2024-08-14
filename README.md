# jest-to-log

## What

Test log messages with [`jest`](https://jestjs.io/)

## Why?

Grown out of the need to test `console.log/error` messages or writes to `process.stdout/stderr` in my cli-facing apps. Note: this is not a full-blown cli-testing tool, but a check for important log messages from your app that's tested with jest.

## Usage

```javascript
require("jest-to-log");
//or
import "jest-to-log";
```

## Example

```javascript
//in jest test file
require("jest-to-log");

describe("toLog", () => {

  it("should capture log messages", () => {

    function testFn() {

      console.info("Jello", 1);
      console.log("Jello", 2);
      console.debug("Jello", 3);
    }
    
    const expectedString =
      "Jello 1" + "\n" + "Jello 2" + "\n" + "Jello 3" + "\n";

    expect(testFn).toLog(expectedString);
  });
});
```

## Async Example

When an `async` function is tested, the `expect` assertions must be awaited.

```javascript
//in jest test file (esm)
import("jest-to-log");

describe("process.stdout.write", () => {

  it("should capture process.stdout.write messages", async () => {

    async function asyncTestFn() {

      await new Promise((resolve) => {

        setTimeout(() => {
          process.stdout.write(`Jello 123\n`);
          process.stdout.write(`Jello 456\n`);

          resolve();

        }, 500);
      });
    }

    const expectedString = "Jello 123" + "\n" + "Jello 456" + "\n";

    await expect(asyncTestFn).toLog(expectedString);
  });
});
```

## Caveat

- When using with typescript (i.e., `ts-jest` and `@types/jest`), it's advised to explicitly import the `expect` from `@jest/globals` to avoid type conflicts:

```javascript
//test.ts

import { expect } from "@jest/globals";

// ...your test
```

- Do NOT set the `injectGlobals` jest option to `false`, or else a `ReferenceError` will be thrown. This is because the matchers are extended onto the `expect` object _without_ importing it from `@jest/globals`.

## Matchers

| Matcher Name       | Description                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `toLog           ` | Checks if a function logs a message via `console.log()`, `console.info()` or `console.debug()`.                                                                              |
| `toLogStdout     ` | Checks if a function **explicitly** writes to `process.stdout`. Cannot be used to capture `console.log/info/debug` calls due to the custom console implementation of `jest`. |
| `toLogStderr     ` | Checks if a function **explicitly** write to `process.stderr`. Cannot be used to capture `console.error/warn` calls due to the custom console implementation of `jest`.      |
| `toLogErrorOrWarn` | Checks if a function logs an error or warning via `console.error()` or `console.warn()`, respectively.                                                                       |

## Installation

`$ npm install jest-to-log`

## Requirements

- Latest versions of `Jest` recommended

## Dependencies

- **0 javascript/nodejs dependency!**

## Test

`$ npm test`
