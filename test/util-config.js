/*
 * @Author: qiansc
 * @Date: 2018-08-15 18:51:32
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-12 19:52:55
 */
const Config = require('../src/util/config');
const Path = require('path');
const expect = require('chai').expect;
const fs = require('fs');

describe("Util Config", () =>{
  let conf, json;
  it("new Config('../config/hello/import')", () => {
    conf =  new Config(Path.resolve(__dirname, '../config/hello/import'));
  });

  it("to JSON", () => {
      json = conf.json();
      console.log(json);
      expect(typeof json.description).to.be.eq('string');
  });

  it("Stringify", () => {
    let str = conf.stringify();
    console.log(str);
    expect(str.length).to.be.gt(0);
  });

  it("get", () => {
    let host = conf.get('input.host');
    console.log(host);
    expect(host.length).to.be.gt(0);
    expect(conf.get('input.host0')).to.be.eq(false);
    expect(conf.get('input.host0.xxx')).to.be.eq(false);
  });

  it("path fill", () => {
    conf =  new Config(Path.resolve(__dirname, './source/config.json'));
    let path = conf.json().path;
    let str = eval.call(null, path);
    str = Path.resolve(str)
    console.log('path => ', str);
    expect(fs.existsSync(str)).to.be.eq(true);
  });
});
