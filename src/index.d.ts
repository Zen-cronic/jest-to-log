declare module "expect" {
  //to-log matchers
  interface Matchers<R> {
    /**
     * Checks if a function logs a message via `console.log()`, `console.info()` or `console.debug()`.
     * @param expected Async or sync function that contains the logging.
     */
    toLog(expected: string): Promise<R> | R;

    /**
     * Checks if a function **explicitly** writes to `process.stdout`. Cannot be used to capture `console.log/info/debug` calls due to the custom console implementation of `jest`.
     * @param expected Async or sync function that contains the logging.
     */
    toLogStdout(expected: string): Promise<R> | R;

    /**
     * Checks if a function **explicitly** write to `process.stderr`. Cannot be used to capture `console.error/warn` calls due to the custom console implementation of `jest`.
     * @param expected Async or sync function that contains the logging.
     */
    toLogStderr(expected: string): Promise<R> | R;

    /**
     * Checks if a function logs an error or warning via `console.error()` or `console.warn()`, respectively.
     * @param expected Async or sync function that contains the logging.
     */
    toLogErrorOrWarn(expected: string): Promise<R> | R;
  }
}

export {};
