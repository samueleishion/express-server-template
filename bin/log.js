const chalk = require('chalk');
const moment = require('moment');

class Log {
  /* eslint-disable no-console */

  constructor(verbose, save) {
    this.reset();

    if (verbose !== undefined) {
      this._verbose = verbose;
    }

    if (save !== undefined) {
      this._save;
    }
  }

  reset() {
    this._verbose = true;
    this._save = false;
    this._file = null;
    this._latest = 'logs/latest.txt';
    this._mute = false;
  }

  mute(value) {
    this._mute = value !== undefined ? value : true;
  }

  _typify(style, type) {
    let result = '';
    const now = moment().format('YYYY-MM-DD HH:mm:ss.SSSS');

    if (this._verbose) {
      result += `${chalk.blackBright(now)} [${style(type)}]`;
    }

    return result;
  }

  print(logger, type, ...message) {
    if (this._mute) {
      return;
    }

    logger(type, ...message);

    // @TODO save to file
  }

  error(...message) {
    const type = this._typify(chalk.red.bold, 'ERROR');
    this.print(console.error, type, ...message);
    this.print(console.log, type, ...message);
  }

  success(...message) {
    const type = this._typify(chalk.green.bold, 'SUCCESS');
    this.print(console.log, type, ...message);
  }

  warning(...message) {
    const type = this._typify(chalk.yellow.bold, 'WARNING');
    this.print(console.warn, type, ...message);
    this.print(console.log, type, ...message);
  }

  info(...message) {
    const type = this._typify(chalk.cyan.bold, 'INFO');
    this.print(console.log, type, ...message);
  }

  data(...message) {
    const type = this._typify(chalk.blackBright.bold, 'DATA');
    this.print(console.log, type, ...message);
  }
}

module.exports = Log;
