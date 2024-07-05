const { Console } = require("node:console");
const { format } = require("util");

// type Formatter = (type: LogType, message: LogMessage) => string;

class CustomConsole extends Console {
  // private readonly _formatBuffer: Formatter;

  #_groupDepth = 0;
  /**
   *
   * @param {string} type
   * @param {string} message
   * @returns {string}
   */
  #_formatBuffer(type, message) {
    //how return string?
    return message
  }
  constructor(stdout, stderr, formatBuffer) {
    super(stdout, stderr);

    // this.#_formatBuffer = formatBuffer;
  }

  /**
   *
   * @param {string} type
   * @param {string} message
   */
  #_log(type, message) {
    super.log(
      this.#_formatBuffer(type, "  ".repeat(this.#_groupDepth) + message)
    );
  }

  /**
   *
   * @param {any} firstArg
   * @param  {Array<any>} args
   */
  log(firstArg, ...args) {
    this.#_log("log", format(firstArg, ...args));
  }
}

const customConsole = new CustomConsole(process.stdout, process.stderr);

customConsole.log("Jello");
