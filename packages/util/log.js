/*
 * @Author: qiansc 
 * @Date: 2018-04-03 13:55:06 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-03 15:13:10
 */

module.exports = Log;
var LEV = 7;

function Log(lev){
    if (lev !== undefined){
        this.lev = lev;
    } else {
        this.lev = 9;
    }
}

['info', 'group', 'groupEnd', 'warn', 'error'].forEach(
    (func) => {
        Log.prototype[func] = function(){
            var arr = Array.apply([], arguments);
            var lev = this.lev;
            var match = arr[0] && arr[0].match(/^L(\d)$/);
            if (match){
                arr.shift();
                lev = match[1];
            }
            if (lev <= LEV){
                console.log.apply(this, arr);
            }
        }
    }
)

Log.setGlobalLev = function(lev){
    if (lev !== undefined) {
        LEV = lev *  1;
    }
}