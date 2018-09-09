/*
 * @Author: qiansc
 * @Date: 2018-09-02 01:09:50
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-09 18:48:03
 */
const Range = require('../src/util/range');
const expect = require('chai').expect;

describe("Util Range", () =>{
  it("new Range('20180808T12', 'P1D')", () => {
    let range = new Range('20180808T12', 'P1D');
    console.log(range.toString(null, ' - '));
    expect(range.duration().as('H')).to.be.eq(24);
  });

  it("new Range('2018-08-08++01:00', null, '2018-08-08 02')", () => {
    let range = new Range('2018-08-08 01', null, '2018-08-08++02:00');
    console.log(range.toString(null, ' - '));
    expect(range.duration().as('m')).to.be.eq(60);
  });

  it("new Range('now--P1D', null, 'now++01:00:00')", () => {
    let range = new Range('now--P1D', null, 'now++01:00:00');
    console.log(range.toString(null, ' - ', 'h'));
    expect(range.duration().as('h')).to.be.eq(25);
  });

  it("new Range(new Date(), '01:00')", () => {
    let range = new Range(new Date(), '01:00');
    console.log(range.toString(null, ' - ' , 's'));
    expect(range.duration().as('s')).to.be.eq(3600);
  });

  it("new Range(date, null, date + 60)", () => {
    let date = new Date().getTime();
    let range = new Range(date, null, date + 60);
    console.log(range.toString(null, ' - ' , 'ms'));
    expect(range.duration().as('ms')).to.be.eq(60);
  });

  it("new Range('now')", () => {
    let range = new Range('now');
    console.log(range.toString());
    expect(range.end().diff(range.start())).to.be.equal(0);
  });

});
