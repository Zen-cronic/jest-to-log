declare module "expect" {
  //to-log matchers
  interface Matchers<R> {
    toLog(expected: string): Promise<R> | R;
    toLogStdout(expected: string): Promise<R> | R;
    toLogStderr(expected: string): Promise<R> | R;
    toLogErrorOrWarn(expected: string): Promise<R> | R;
  }
}

export {};
