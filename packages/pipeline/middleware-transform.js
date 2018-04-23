/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 13:26:55
 */

var util = require('util');
var Transform = require('../pipeline/transform');
var MiddleWareFactory =  require('../middleware/factory');

class ExtractTransform extends Transform{
    constructor (config) {
        super(config);
        this.lines = 0;
        // 获取middlewares config
        var middlewareConfig = this.config.middleware;
        this.middleware = MiddleWareFactory.create(middlewareConfig.module, middlewareConfig);
    }
    _transform (buffer, encoding, callback) {
        this.middleware.handle(buffer, result => {
            if (result) {
                this.push(result);
            }
            callback();
        });
    }

}




module.exports = ExtractTransform;