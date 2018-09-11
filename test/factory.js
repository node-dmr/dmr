/*
 * @Author: qiansc
 * @Date: 2018-09-12 01:18:23
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-12 01:33:21
 */
const SourceFactory = require('../src/factory/source');
const Source = require('dmr-source');
const expect = require('chai').expect;

describe("SourceFactory", () =>{
  let source;
  it("HttpSource", () => {
    source = SourceFactory.create({source: 'HttpSource'});
    expect(Source.HttpSource.prototype.isPrototypeOf(source)).to.be.eq(true);
    source = SourceFactory.create({source: 'http'});
    expect(Source.HttpSource.prototype.isPrototypeOf(source)).to.be.eq(true);
  });

  it("FileSource", () => {
    source = SourceFactory.create({source: 'FileSource'});
    expect(Source.FileSource.prototype.isPrototypeOf(source)).to.be.eq(true);
    source = SourceFactory.create({source: 'file'});
    expect(Source.FileSource.prototype.isPrototypeOf(source)).to.be.eq(true);
  });

  it("FtpSource", () => {
    source = SourceFactory.create({source: 'FtpSource'});
    expect(Source.FtpSource.prototype.isPrototypeOf(source)).to.be.eq(true);
    source = SourceFactory.create({source: 'ftp'});
    expect(Source.FtpSource.prototype.isPrototypeOf(source)).to.be.eq(true);
  });

  it("Null Source", () => {
    source = SourceFactory.create({source: 'None'});
    expect(source).to.be.eq(undefined);
  });
});
