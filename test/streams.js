const stream = require('stream');

class FakeWritable extends stream.Writable {
  constructor() {
    super();
    this.text = '';
  }
  _write(chunk, _encoding, callback) {
    if (Buffer.isBuffer(chunk)) {
      this.text += chunk.toString('utf8');
    } else {
      this.text += chunk;
    }
    callback();
  }
}

class FakeReadable extends stream.Readable {
  constructor() {
    super();
    this._queue = '';
  }

  enqueue(string) {
    this._queue += string;
  }

  _read(_size) {
    this.push(this._queue);
    this._queue = '';
  }
}

module.exports.FakeWritable = FakeWritable;
module.exports.FakeReadable = FakeReadable;
