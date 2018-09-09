/*
 * @Author: qiansc
 * @Date: 2018-04-02 10:35:47
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-09 19:14:39
 */
var Moment = require('moment');
var Duration = Moment.duration;

class Range {
  /**
   * Time Range
   * Moment Prase API http://momentjs.com/docs/#/parsing/ ,
   * Moment Prase Extra Support [++/--duration] and [now] such as :
   * moment++duration , now--duration .
   * Duration Create API http://momentjs.com/docs/#/durations/

   * @param  {Moment|Date} [start] Start Moment
   * @param  {Duration} [duration] End Moment or Duration
   * @param  {Moment|Date} [end] End Moment or Duration
   * @example
   * new Range('2018-09-01 12:00:00', '01:00:00');
   * new Range('20180901T12', 'P1H');
   * new Range('20180901', null, Moment('20180902'));
   * new Range('now--60000', null, 'now');
   * new Range(new Date().getTime() - 60000, null, new Date());
   *
   */
  constructor(start, duration, end) {
    this.set(start, duration, end);
  }
  /**
   * set start / end ( Date | Timestamp) for range
   * @param  {Moment|Date} [start] Start Moment
   * @param  {Moment|Date|Duration} [end] End Moment or Duration
   */
  set (start, duration, end) {
    this.start(start);
    duration && this.duration(duration);
    end && this.end(end);
  }

  /**
   * set start Moment for range, Moment API http://momentjs.com/docs/
   * @param  {Moment|Date} [start] Start Moment
   * @returns {Moment} start Moment
   */
  start (start) {
    if (start !== undefined) {
      this._moment =  this.normalizeMoment(start);
    }
    return this._moment;
  }

  /**
   * set end Moment for range
   * @param  {Moment|Date} [end] end Moment
   * @returns {Moment} end Moment
   */
  end (end) {
    /* istanbul ignore if */
    if (!this._moment) {
      throw new Error('invalid end moment!');
    }
    if (end !== undefined) {
      this._duration = Moment.duration(this.normalizeMoment(end).diff(this._moment));
    }
    return this._moment.clone().add(this._duration || 0);
  }

  /**
   * duration for range, Duration API http://momentjs.com/docs/#/durations/
   * @param  {Duration} [duration] duration
   * @param  {Date|Timestamp} [start]
   * @returns {Duration} durations
   * @example
   *
   * console.log(new Range().duration(1000, new Date()).as('s')); // 1
   *
   */
  duration (duration, start) {
    this.start(start);
    if (duration !== undefined) {
      this._duration = Moment.duration(duration);
    }
    return this._duration;
  }

  /**
   * @param  {string} [Mformat] format of moment
   * @param  {string} [separater] separater bwtween moment and durations
   * @param  {string} [Dformat] format of duration
   */
  toString(Mformat, separater, Dformat) {
    separater = separater || /* istanbul ignore next */ ' , ';
    if (this._moment && this._duration) {
      return [
        this._moment.format(Mformat),
        Dformat ? this._duration.as(Dformat) + Dformat : this._duration.humanize(),
        this.end().format(Mformat)
      ].join(separater);
    } else {
      return 'Invalid Range';
    }

  }

  /**
   * @private
   * @param  {Date|Moment|MomentExtraDuration}
   */
  normalizeMoment(m) {
    let d = Moment.duration(0);
    let action = 'add'; // subtract
    if (typeof m === "string") {
      let match = m.match(/^(.+)(\+\+|\-\-)(.+)$/);
      if (match) {
        m = match[1];
        if (match[2] !== '++') {
          action = 'subtract';
        }
        d = Moment.duration(match[3]);
      }
      if (m.toLowerCase() === 'now') {
        let now = new Date().getTime();
        // keep same now when one sync exec
        if (this.now && now - this.now < 5 ) {
          now = this.now;
        } else {
          this.now = now;
        }
        m = Moment(now);
      }
    }
    return Moment(m)[action](d);
  }

}

module.exports = Range;
