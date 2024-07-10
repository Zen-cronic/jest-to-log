declare module "expect" {
  //to-log matchers
  interface Matchers<R> {
    toLog(expected: string): R;
    toLogStdout(expected: string): R;
    toLogStderr(expected: string): R;
    toLogErrorOrWarn(expected: string): R;
  }
}

export {};
