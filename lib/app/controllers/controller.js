/*
 * @Author: qiansc 
 * @Date: 2018-06-25 13:30:37 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-25 20:13:50
 */

class Controller {
    constructor() {

    }
    get(req, res, next) {
        this.do('get', req, res, next);
    }
    do(type, req, res, next) {
        let action = req.params[0] || '';
        action = action.replace(/[\s\t\-\_]/g,"");
        let fun = type + (action[0] || '').toUpperCase() + action.substring(1);
        if (req.params && req.params[0] && this[fun]) {
            this[fun](req, res, next);
        } else {
            res.send('no matched router for ' + action + ' :: ' + fun + ' !');
        }
    }
}
module.exports = Controller;