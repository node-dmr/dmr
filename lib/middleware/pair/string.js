/*
 * @Author: qiansc 
 * @Date: 2018-05-19 00:38:10 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-19 23:52:30
 */
const Pair = require('./pair');

class Performance extends Pair {
    constructor (config) {
        super(config);
    }
    deal (part) {
        return [
            [this.config, part]
        ];
    }
}
module.exports = Performance;