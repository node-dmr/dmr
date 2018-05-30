/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-30 16:55:59
 */

var util = require('util');
var Transform = require('../pipeline/transform');
var MiddleWareFactory =  require('../middleware/factory');
var Result = require('../entity/result');

class ExtractTransform extends Transform{
    constructor (config) {
        super(config);
        // 获取middlewares config
        let middlewareConfig = this.config.middleware;
        this.middleware = MiddleWareFactory.create(middlewareConfig);
    }
    _transform (buffer, encoding, callback) {
        let result = new Result();
        this.middleware.handle(buffer.toString(), r => {
            result = result.concat(r);
        });
        this.push(result);
        callback();
    }

}

function togather () {

}


module.exports = ExtractTransform;