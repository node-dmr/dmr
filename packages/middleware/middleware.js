/*
 * @Author: qiansc 
 * @Date: 2018-04-22 23:24:28 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 00:01:24
 */
class Middleware {
    constructor (config) {
        this.config = config;
    }
    handle (data, next){
        console.error("handble method needs to be implemented!");

        return next;
    }

}

module.exports = Middleware;