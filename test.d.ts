declare module "expect" {
  interface AsymmetricMatchers {
    toBeWithinRange(floor: number, ceiling: number): void;
  }
  interface Matchers<R> {
    toBeWithinRange(floor: number, ceiling: number): R;
  }
  interface Matchers<R> {
    toConsoleLog(expected: string): R;
  }
  interface Matchers<R> {
    toConsoleInfo(expected: string): R;
  }
  interface Matchers<R> {
    toStdoutLog(expected: string): R;
    
  }
  interface Matchers<R>{
    toLog(expected: string): R;
  }
}

export {};
