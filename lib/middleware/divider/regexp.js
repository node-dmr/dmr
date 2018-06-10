/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-08 12:47:00
 */
const Divider = require('./divider');

class Regexp extends Divider {
    constructor(config) {
        super(config);
        if (config.partten) {
            let part = config.partten.match(/^\/(.*)\/(\w)*$/);
            this.partten = new RegExp(part[1],part[2]);
        }
    }
    deal (string) {
        let partten =  this.partten;
        if(this.partten) {
            let matches = string.match(this.partten);
            // console.log(RegExp.$0);
            // console.log(matches.length);
            return matches || [];
        }
        return [];
    }
}

module.exports = Regexp;