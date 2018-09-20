/*
 * @Author: qiansc
 * @Date: 2018-08-06 15:00:06
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-08-06 15:52:08
 */
let log = {
  _tabDeep: 0,
  tab: function () {
    this._tabDeep ++;
  },
  tabEnd: function() {
    this._tabDeep --;
    this._tabDeep =  Math.max(0, this._tabDeep);
  },
  line: function(){
    this.info('------------------------------------------------------------------------');
  }
};

['info', 'group', 'groupEnd', 'warn', 'error', 'time', 'timeEnd'].forEach(
  (func) => {
    log[func] = function() {
          let arr = Array.apply([], arguments);
          if (log._tabDeep > 0) {
            arr = [new Array(log._tabDeep).join('  ')].concat(arr);
          }
          console[func].apply(this, arr);
      }
  }
);

module.exports = log;
