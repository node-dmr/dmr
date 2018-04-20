/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-20 20:26:30
 */
var Log =require('../util/log');

var log = new Log(5);

class Middleware{
    constructor (config) {
        // super(config);
        this.config = config;
        var partten = this.config.partten;
        if (partten) {
            partten = partten.match(/\/(.*)\/(\w)*/);
            this.partten = new RegExp(partten[1],partten[2]);
            // console.log(this.partten);
        }
    }
    handle (string) {
        var cloume = this.config.cloume || {};
        if (this.partten) {
            var kv = string.match(this.partten);
            var key = kv[1];
            var value = kv[2];
            if (cloume[key]){
                if(cloume[key].necessary === "true" && !value){
                    return false;
                }
                return [key, value];
            } else {
                return false;
            }
            
        } else {
            return false;
        }
    }

}

module.exports = Middleware;