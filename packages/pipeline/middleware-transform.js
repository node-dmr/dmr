/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-20 20:27:57
 */

var util = require('util');
var Transform = require('../pipeline/transform');
var MiddleWareFactory =  require('../middleware/factory');

class ExtractTransform extends Transform{
    constructor (config) {
        super(config);
        this.lines = 0;
    }
    _transform (buffer, encoding, callback) {
        var configs = this.config.middleware || [];
        var rs = buffer;
        configs.forEach(config => {
            if (rs !== false){
                var middleware = MiddleWareFactory.create(config.module, config);
                if (Array.isArray(rs)) {
                    if (middleware.config.input === "element"){
                        var arr = [];
                        rs.forEach(element => {
                            var ele = middleware.handle(element);
                            if (ele !== false) {
                                arr.push(ele);
                            }
                        });
                        rs = arr;
                    } else {
                        rs = middleware.handle(rs);
                    }
                } else {
                    rs = middleware.handle(rs);
                }
                
            
                // console.log('ERR',rs,buffer.toString());
                // 
                // callback();
            }

        });
        if (rs !== false) {
            this.push(rs);
            callback();
        } else {
            callback();
        }
        //  临时写入了业务逻辑，等待抽象
        // var partten = /(\w+=.*?)\s/g;// /\s(id=.*)\s(urlpack=\(.*\}\))\s(cmd=.*)/;
        // var kvPartten = /(\w+)=(.*?)\s/;
        // 获取cloumes 配置
        // var config = this.config.cloume;
        // var slices = data.toString().match(partten);
        // var result = [];
        // if (slices) {
        //     for (var i = 0; i < slices.length; i++){
        //         var kv = slices[i].match(kvPartten);
        //         var key = kv[1];
        //         var value = kv[2];
        //         // 配置存在
        //         if (config[key]){
        //             if(config[key].necessary === "true" && !value){
        //                 callback();
        //                 return;
        //             } else {
        //                 result.push(value || '-');
        //             }
        //         }
        //     }
        // }
        // this.push(result.join('\t'));


        
    };
}




module.exports = ExtractTransform;