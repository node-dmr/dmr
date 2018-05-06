/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-02 23:59:43
 */

var Transform = require('../pipeline/transform');
var MapToRowMiddleware = require('../middleware/middleware-map-to-row');

var util = require('util');

class Formater extends Transform{
    constructor (config) {
        config.writableObjectMode = true;
        config.readableObjectMode = config['object-mode'] || false;
        super(config);
        config["column-separate"] = config["column-separate"] || "\t";
        config["line-separate"] = config["line-separate"] || "\n";
        config["header"] = config["header"] === false ? false : true;

        if (config.columns !== "all") {
            this._setMiddleware(config.columns);
        }
        if (!config.readableObjectMode && config.header === true) {
            this.on('header', line => {
                this.push(line.header.join(config["column-separate"]) + config["line-separate"]);
            });
        }
        this.lines = 0;
    }
    _setMiddleware(columns){
        this.middleware = new MapToRowMiddleware({
            "columns": columns
        });
    }
    _transform(object, encoding, callback){
        if (this.lines === 0 && this.config.columns === "all"){
            
            this._setMiddleware(Object.keys(object));
        }

        this.middleware.handle(object, line => {
            if (line && line.result) {
                if (this.lines === 0){
                    // 第一行时候发起header事件，输出表头
                    this.emit('header', {
                        "header": line.header
                    });
                }
                var result = line.result;
                if (!this.config.readableObjectMode) {
                    result =  result.join(this.config["column-separate"]) + this.config["line-separate"];
                }
                this.push(result);
                this.lines ++;
            }
        });
        callback();
    }
}



class Parser extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
        super(config);
        config["column-separate"] = config["column-separate"] || "\t";
        this.lines = 0;
    }
    _transform(string, encoding, callback){
        if (Buffer.isBuffer(string)) {
            string = string.toString();
        }
        if (this.lines === 0 ){
            this.header = string.split(this.config["column-separate"]);
        } else if(this.header && this.header.length){
            var map = {};
            string = string.split(this.config["column-separate"]);
            this.header.forEach((name ,index) => {
                map[name] = string[index];
            });
            this.push(map);
        }
        this.lines ++;
        callback();
    }
}
module.exports = {
    Formater: Formater,
    Parser: Parser
};