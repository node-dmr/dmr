/*
 * @Author: qiansc 
 * @Date: 2018-05-18 08:20:59 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-18 10:46:25
 */
const Divider = require('./divider');

class Separate extends Divider {
    split (string) {
        let separater = this.config.separater;
        if (separater) {
            return string.split(separater);
        }
        return [];
    }
}

module.exports = Separate;