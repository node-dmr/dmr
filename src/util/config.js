/*
 * @Author: qiansc
 * @Date: 2018-08-06 17:58:45
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-08-06 23:52:15
 */
const Path = require('path');
const fs = require('fs');
const minify = require("node-json-minify");

class Config {
  /**
   *
   * @param  {pathLike} path
   * @example
   * let conf = new Config('config/hello/import.task');
   */
  constructor(path) {
    this._path = Path.resolve(path);
    let json, content = fs.readFileSync(path, {
      encoding: 'utf-8'
    });
      // 支持 JSON 文件写 // 注释
    content = minify(content);
    json = JSON.parse(content);
  }
  /**
   * Config Factory
   * @param  {pathLike} path
   * @returns {Config|null}
   */
  static load(path){
    if (fs.existsSync(path)) {
      return new Config(path);
    } else {
      return null;
    }
  }
}
module.exports = Config;
