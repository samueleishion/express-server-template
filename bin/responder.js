const Log = require('@est/bin/log');
const log = new Log();

class Responder {
  constructor() {
    this.reset();
  }

  setResponse(r) {
    this._response = r;
  }

  setEndpoint(e) {
    this._endpoint = e;
  }

  setType(t) {
    this._type = t;
  }

  setStatus(s) {
    this._status = s;
  }

  setMessage(m) {
    this._message = m;
  }

  setEntry(e) {
    this._entry = e;
  }

  setError(e) {
    this._error = e.toString();
  }

  reset() {
    this._response = null;
    this._endpoint = '';
    this._type = '';
    this._status = 0;
    this._message = '';
    this._entry = [];
    this._error = null;
  }

  send() {
    if (this._response !== null) {
      // console.log(this._endpoint, `[${this._type}]`, this._status, this._message);
      log.info(this._endpoint, `[${this._type}]`, this._status, this._message);

      if (this._error !== null) {
        // console.error(this._error);
        log.error(this._error);
      }

      this._response.send({
        status: this._status,
        message: this._message,
        error: this._error,
        entry: this._entry
      });

      this.reset();
      return true;
    } else {
      // console.error(this._endpoint, `[${this._type}]`, 'Response is null.');
      // console.log(this._endpoint, `[${this._type}]`, 'Response is null.');
      log.error(this._endpoint, `[${this._type}]`, 'Response is null');
      return false;
    }
  }
}

module.exports = Responder;
