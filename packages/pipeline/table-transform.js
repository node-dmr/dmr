/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-25 15:28:24
 */

var Transform = require('../pipeline/transform');
var MapToRowMiddleware = require('../middleware/map-to-row-middleware');

var util = require('util');
class TabelTransform extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
        super(config);
        this.middleware = new MapToRowMiddleware({
            "cloumes": config.cloumes
        });
        this.lines = 0;
    }
    _transform(object, encoding, callback){
        if (this.config.action === "format") {

            // map 2 line
            this.middleware.handle(object, line => {
                if (line && line.result) {
                    if (this.lines === 0){
                        // 第一行时候发起header事件，输出表头
                        this.emit('header', {
                            "header": line.header
                        });
                    }
                    this.push(line.result);
                    this.lines ++;
                }
            });
        } else if (this.config.action === "unformat") {

        }
        callback();
    }
}

module.exports = TabelTransform;