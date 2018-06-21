/*
 * @Author: qiansc 
 * @Date: 2018-06-10 13:59:35 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-15 10:51:11
 */
const Divider = require('./divider');
const deformat = require('deformat');

class Deformat extends Divider {
    constructor (config) {
        super(config);
        this.deformat = deformat(this.config.combined);
    }
    deal (string) {
        let rs = this.deformat.exec(string);
        return rs || false;
    }
}

module.exports = Deformat;