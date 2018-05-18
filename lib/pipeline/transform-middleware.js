/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-18 11:38:48
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
        this.middleware = MiddleWareFactory.create(middlewareConfig);
    }
    _transform (buffer, encoding, callback) {
        this.middleware.handle(buffer.toString(), line => {
            // if (line) {
            //     this.push(line);
            // }
            callback();
        });
    }

}




module.exports = ExtractTransform;