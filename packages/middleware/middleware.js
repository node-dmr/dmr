/*
 * @Author: qiansc 
 * @Date: 2018-04-22 23:24:28 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 12:42:11
 */
class Middleware {
    constructor (config) {
        this.config = config;
    }
    handle (data, next){
        if (this._handle  === undefined) {
            console.error("handle or _handle method needs to be implemented!");
        }
        return next;
    }
    // _handle (data) {
    //      return data;
    // }

}

module.exports = Middleware;