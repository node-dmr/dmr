/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-19 18:25:57
 */

var Transform = require('../pipeline/transform');
var util = require('util');
class ExtractTransform extends Transform{
    constructor (config) {
        super(config);
    }
    _transform (data, encoding, callback) {
        //  临时写入了业务逻辑，等待抽象
        var partten = /(\w+=.*?)\s/g;// /\s(id=.*)\s(urlpack=\(.*\}\))\s(cmd=.*)/;
        var kvPartten = /(\w+)=(.*?)\s/;
        // 获取cloumes 配置
        var config = this.config.cloume;
        var slices = data.toString().match(partten);
        var result = [];
        if (slices) {
            for (var i = 0; i < slices.length; i++){
                var kv = slices[i].match(kvPartten);
                var key = kv[1];
                var value = kv[2];
                // 配置存在
                if (config[key]){
                    if(config[key].necessary === "true" && !value){
                        callback();
                        return;
                    } else {
                        result.push(value || '-');
                    }
                }
            }
        }
        this.push(result.join('\t'));
        callback();
    };
}




module.exports = ExtractTransform;