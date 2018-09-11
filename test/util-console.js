/*
 * @Author: qiansc
 * @Date: 2018-09-11 12:31:55
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-12 00:17:40
 */
const con = require('../src/util/console');
const expect = require('chai').expect;

describe("Util Console", () =>{
  it("con.stream write hello", () => {
    con.stream.write('hello');
  });

  it("con.stream write array", () => {
    con.stream.write(['A', 'B', 'C']);
  });

  it("con.stream write array", () => {
    con.stream.write(['A', 'B', 'C']);
  });

  it("con.stream Hold channel 2", () => {
    let stream = con.channel(2, false);
    stream.write(['Sucess get channel 2']);
    stream.cache(true);
    stream.write(['Hold channel 2']);
  });

  it("con.stream Continue channel 2", () => {
    let stream = con.channel(2);
    stream.write(['Continue channel 2']);
    stream.cache(false);
    stream.write(['End channel 2']);
  });

  it("con.stream Continue channel 2 cache", () => {
    let stream = con.channel(2);
    stream.cache(true);
    stream.write('A');
    stream.write('B');
    stream.write(['C']);
    stream.cache(false);
  });

  it("con.stream Continue channel 2 readSync", () => {
    let stream = con.channel(2);
    stream.cache(true);
    stream.write('A');
    stream.write('B');
    stream.write(['C']);

    expect(stream.readSync().length).to.be.equal(3);

    expect(stream.readSync().length).to.be.equal(0);

  });
});
