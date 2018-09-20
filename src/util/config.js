/*
 * @Author: qiansc
 * @Date: 2018-08-06 17:58:45
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-12 19:52:18
 */
const Path = require('path');
const fs = require('fs');
const minify = require("node-json-minify");
const stringify = require('json-stringify-safe');
const _ = require('underscore');

class Config {
  /**
   *
   * @param  {Path} path
   * @param  {Object} scope for config cache
   * @example
   * let conf;
   * conf = new Config('hello/import');
   * console.log(conf.json());
   *
   */
  constructor(path, scope) {
    this.path = path;
    this.scope = scope || {
      json: {}
    };
    this.conf = false;
    this.isConfig = true;
    this.scope[path] = this;
    this.fetch();
  }

  /**
   * get config json
   * config will be load when called
   * @returns {JSON} config json
   */
  json() {
    let cache = this.scope.json;
    let json = {};
    if (cache && cache[this.path]) return cache[this.path];
    cache[this.path] = json;
    function normalize(conf) {
      Object.keys(conf).forEach(key => {
        if (typeof conf[key] === "object") {
          if (conf[key].isConfig) {
            conf[key] =  conf[key].json();
          } else {
            conf[key] = normalize(conf[key]);
          }
        }
      });
      return conf;
    }

    Object.assign(json, normalize(this.conf));
    return json;
  }

  /**
   * stringify config
   * @param  {indent} indent format string
   * @returns {String}
   */
  stringify(indent) {
    indent = indent || 0;
    return stringify(this.json(), null, indent);
  }

  get(attr) {
    let result = this.json();
    attr = attr.split(".");
    attr.forEach(a => {
      if (!result) return;
      // if (result && result.isConfig) {
      //   result = result.get(a);
      // } else {
        result = result[a] || /* istanbul ignore next */ false;
      //}
    });
    return result;
  }
  /**
   * @private
   * @param  {pathLike} path
   */
  _getSubConf(path) {
    if (this.scope[path]) {
      return this.scope[path];
    }
    let sub = new Config(path, this.scope);
    return sub;
  }
  /**
   * @private
   */
  fetch() {
    this._json = null;
    let conf =  this._getJson(this.path);
    this.conf =  this._processConfig(conf);
  }
  /**
   * @private
   * @param {JSON} conf
   * @returns {JSON}
   */
  _processConfig(conf) {
    Object.keys(conf).forEach(key => {
      if (typeof conf[key] === "object") {
        conf[key] = this._processConfig(conf[key]);
      } else if(typeof conf[key] === "string") {
        let matches = conf[key].match(/^(source|pipe):(.+)$/);
        if (matches) {
          let path;
          if (matches[2].indexOf('/') === 0) {
            // support "pipe:/xxxx/xxxx" , based on dmr /config such as /common
            path = Path.resolve(__dirname, '../../config', '.' + matches[2]);
          } else if (matches[2].indexOf('./') === 0) {
            // support "pipe:./xxxxx" , based on current config file
            path = Path.resolve(Path.dirname(this.path), matches[2]);
          } else {
            // support "pipe:xxxx" , based on current config file dir
            path = Path.resolve(Path.dirname(this.path), './' + matches[1] + '.' + matches[2]);
          }
          conf[key] = this._getSubConf(path);
        } else if (_.indexOf(['path', 'file'], key) > -1 && conf[key] && conf[key].indexOf('`.') > -1){
          conf[key] = '`'+ Path.dirname(this.path) + '/' + conf[key].substring(1);
        }
      /* istanbul ignore else */
      }
    });
    return conf;
  }

  /**
   * @private
   * @param  {Path} path
   * @returns {JSON}
   */
  _getJson(path) {
    this._path = Path.resolve(path);
    let content = fs.readFileSync(path, {
      encoding: 'utf-8'
    });
    // 支持 JSON 文件写 // 注释
    content = minify(content);
    return JSON.parse(content);
  }
}
module.exports = Config;
