/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-18 23:50:49
 */
const Divider = require('./divider');

class Separate extends Divider {
    deal (string) {
        let separater = this.config.separater;
        if (separater) {
            return string.split(separater);
        }
        return [];
    }
}

module.exports = Separate;