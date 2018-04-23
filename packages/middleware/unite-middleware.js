/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 16:29:34
 */
var Middleware = require('../middleware/middleware');

class UniteMiddleware extends Middleware{
    constructor (config) {
        super(config);
        this.type = null;
        this.header = [];
        this.config.cloume.forEach(element => {
            this.header.push(element.name || element);
        });
    }
    handle (array, next) {
        if(!array || array.length === 0){
            return next(false);
        }
        var result = [];
        var header = this.header;
        var mark = true;

        array.forEach(element => {
            var index = header.indexOf(element.name);
            if (index > -1) {
                // 需要覆盖
                if (!result[index] || this.config.overwriteMode){
                    result[index] = element.value;
                }
            }
        });
        header.forEach(name => {
            // 如不存在或者可以覆盖
            if (!validate(result[name], this.config.cloume[name])){
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
module.exports = UniteMiddleware;