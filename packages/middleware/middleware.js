/*
 * @Author: qiansc 
 * @Date: 2018-04-22 23:24:28 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 16:58:17
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
}

module.exports = Middleware;