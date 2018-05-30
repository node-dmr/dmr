/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-30 19:02:23
 */

var Transform = require('../pipeline/transform');

var util = require('util');
var Result = require('../entity/result');

class Formater extends Transform{
    constructor (config) {
        config.writableObjectMode = true;
        config.readableObjectMode = config['object-mode'] || false;
        super(config);
        config["field-separate"] = config["field-separate"] || "\t";
        config["line-separate"] = config["line-separate"] || "\n";
        config["header"] = config["header"] === false ? false : true;

        // if (config.fields !== "all") {
        //     // 如果fields为all 则第一次时候根据数据来设置fields
        //     this._setMiddleware(config.fields);
        // }
        if (!config.readableObjectMode && config.header === true) {
            // 非object模式 且需要header时 header事件时输出头部
            this.on('header', line => {
                this.push(line.header.join(config["field-separate"]) + config["line-separate"]);
            });
        }
        this.lines = 0;
        this.fields = config.fields || "all";
    }
    _transform(result, encoding, callback){
        if (this.lines === 0) {
            if (this.fields.length === 0 || this.fields === "all"){
                this.fields = result.keys();
            }
            this.emit('header', {
                "header": this.fields
            });
        }
        let row = [];
        this.fields.forEach(field => {
            row.push(result.get(field));
        });
        if (this.config.readableObjectMode === false) {
            // 文本输出
            row =  row.join(this.config["field-separate"]) + this.config["line-separate"];
        }
        this.push(row);
        this.lines ++;
        callback();
    }
}



class Parser extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
        super(config);
        config["field-separate"] = config["field-separate"] || "\t";
        this.lines = 0;
    }
    _transform(string, encoding, callback){
        if (Buffer.isBuffer(string)) {
            string = string.toString();
        }
        if (this.lines === 0 ){
            this.header = string.split(this.config["field-separate"]);
        } else if(this.header && this.header.length){
            var result = new Result();
            string = string.split(this.config["field-separate"]);
            this.header.forEach((name ,index) => {
                result.set(name, string[index]);
            });
            this.push(result);
        }
        this.lines ++;
        callback();
    }
}
module.exports = {
    Formater: Formater,
    Parser: Parser
};