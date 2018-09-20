/*
 * @Author: qiansc
 * @Date: 2018-09-11 11:02:22
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-12 00:21:54
 */
const Transform = require('stream').Transform;

class Console extends Transform {

  /**
   * @param  {Object} [option]
   * @param  {number} [option.cache] - 0 - print to console 1 - save for get
   */
  constructor (cache) {
    super({
      objectMode: true
    });
    this._cache = cache || false;
    this.buffer = [];
  }

  _transform(chunk, encoding, callback){
      if (!this._cache) {
        this.flush(normallize(chunk));
      } else {
        this.buffer.push(normallize(chunk));
      }
      callback();
  }

  cache(cache){
    this._cache = cache;
    if (!this._cache) {
      this.flush();
    }
  }

  flush(chunk) {
    chunk && log(chunk);
    this.buffer.forEach(item => {log(item);});
    this.buffer = [];
    function log(item) {
        console.log.apply(console, item);
    }
  }

  static channel(id, cache) {
    id = id || '0';
    Console._stream[id] = Console._stream[id] || new Console(cache);
    return Console._stream[id];
  }

  readSync() {
    let buffer = this.buffer;
    this.buffer = [];
    return buffer;
  }

}
function normallize(chunk) {
  if (!Array.isArray(chunk)) {
    chunk = [chunk];
  }
  return chunk;
}

Console._stream = {
  '0' : new Console()
}

Console.stream = Console.channel();

module.exports = Console;
