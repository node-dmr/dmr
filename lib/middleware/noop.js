/*
 * @Author: qiansc 
 * @Date: 2018-06-10 13:59:35 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-10 15:24:20
 */
const Middleware = require('./middleware');
class Noop extends Middleware {
    _handle (data, next,) {
        return false;
    }
}

module.exports = Noop;