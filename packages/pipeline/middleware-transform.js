/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 18:55:53
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
        this.middleware.handle(buffer, line => {
            if (line && line.result) {
                // console.log(extra);
                if (this.lines == 0 && line && line.header) {
                    this.emit('header', line.header);
                }
                if (line.header.length > 10){
                    // console.log(buffer.toString());
                }
                this.lines ++;
                this.push(line.result);
            }
            callback();
        });
    }

}




module.exports = ExtractTransform;