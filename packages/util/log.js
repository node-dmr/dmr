/*
 * @Author: qiansc 
 * @Date: 2018-04-03 13:55:06 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-03 18:32:23
 * 
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
['info', 'group', 'groupEnd', 'warn', 'error'].forEach(
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