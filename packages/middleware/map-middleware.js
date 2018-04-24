/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-24 20:39:50
 */
var Middleware = require('../middleware/middleware');

class MapMiddleware extends Middleware{
    constructor (config) {
        super(config);
        this.type = null;
        this.header = [];
        this.rules = {};
        this.config.cloume.forEach(element => {
            this.header.push(element.name || element);
            if (typeof element === "object") {
                this.rules[element.name] = element;
            } 
        });
    }
    handle (data, next) {
        if(!data){
            return next(false);
        }
        var result = [];
        var header = this.header;
        var mark = true;
        Object.keys(data).forEach(key => {
            var index = header.indexOf(key);
            if (index > -1) {
                // 需要覆盖
                result[index] = data[key];
            }
        });
        header.forEach((name, index) => {
            // 如不存在或者可以覆盖
            if (!validate(result[index], this.rules[name])){
                // 不合法，此行数据作废
                mark = false;
            }
        });
        if (mark === false) {
            return next(false);
        }
        return next({
            "header": header,
            "result": result
        });
    }
}
function validate (value, config) {
    config = config || {};
    if (config.necessary && !value) {
        return false;
    }
    return true;
}
module.exports = MapMiddleware;