/*
 * @Author: qiansc 
 * @Date: 2018-04-22 23:24:28 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-10 16:06:20
 */
class Middleware {
    constructor (config) {
        this.config = config;
    }
    handle (data, next, index){
        if (this.config.debug) {
            let info = (this.config.debug === "true"? '$index : $data' : this.config.debug);
            info =  info.replace('$index', index || "").replace('$data', data);
            
            let oldNext = next;
            next = function (result) {
                info = info.replace('$result', '%s');
                console.log('[Middleware Debug] '+ info, result);
                info = false;
                oldNext.apply(this, arguments);
            }
            let rs = this._handle.call(this, data, next, index);
            if (info) {
                console.log('[Middleware Debug] '+ info);
            }
            return rs;
            
        }
        return this._handle.apply(this, arguments);
    }
    _handle (data, next) {
        console.error("handle or _handle method needs to be implemented!");
        return next;
    }
}

module.exports = Middleware;