/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-15 10:51:23
 */
const Divider = require('./divider');

class Separate extends Divider {
    deal (string) {
        return [string];
    }
}

module.exports = Separate;