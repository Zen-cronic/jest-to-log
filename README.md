# jest-to-log

# What

Test log messages with [`jest`](https://jestjs.io/)

# Why?

# Usage

```javascript
require("jest-to-log");
//or
import "jest-to-log";
```

# Example

# Matchers

| Matcher Name       | Description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `toLog           ` | Checks if a function logs a message via `console.log()`                                               |
| `toLogStdout     ` | Checks if a function **explicitly** writes to `process.stdout`                                        |
| `toLogStderr     ` | Checks if a function **explicitly** write to `process.stderr`                                           |
| `toLogErrorOrWarn` | Checks if a function logs an error or warning via `console.error()` or `console.warn()`, respectively |

# Installation

`$ npm install jest-to-log`

# Requirements

- `Jest`
- `Nodejs >= 14`

# Dependencies

- **0 javascript/nodejs dependency!**

# Test

`$ npm test`
