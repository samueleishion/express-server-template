const fs = require('fs');

class File {
  static read(path) {
    return fs.readFileSync(require.resolve(path));
  }

  static json(path, callback) {
    return JSON.parse(File.read(path));
  }
}

module.exports = File;
