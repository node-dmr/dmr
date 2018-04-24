/*
 * @Author: qiansc 
 * @Date: 2018-04-03 13:55:06 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-24 10:54:12
 * Log模块提供统一的日志信息输出控制，可以按参数控制不输出，输出部分重要级别（默认），完整输出日志功能。
 * 默认全局日志级（LEV）别为7，默认新建log默认级别也为7
 * 当单次输出的log的级别高于全局日志级别（LEV）则不打印
 */

module.exports = Log;
// 全局lev设置
var LEV = 7;

function Log(lev){
    if (lev !== undefined){
        this.lev = lev;
    } else {
        this.lev = 7;
    }
}

// 为console的各种方法扩展第一个参数"L\d"，动态指示当次输出的lev
['info', 'group', 'groupEnd', 'warn', 'error', 'time', 'timeEnd'].forEach(
    (func) => {
        Log.prototype[func] = function(){
            var arr = Array.apply([], arguments);
            var lev = this.lev;
            var match = arr[0] && typeof arr[0] === 'string' && arr[0].match(/^L(\d)$/);
            if (match){
                arr.shift();
                lev = match[1];
            }
            if (lev <= LEV){
                console[func].apply(this, arr);
            }
        }
    }
)

Log.setGlobalLev = function(lev){
    if (lev !== undefined) {
        LEV = lev *  1;
    }
}