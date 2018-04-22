/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 01:18:55
 */

var util = require('util');
var Transform = require('../pipeline/transform');
var MiddleWareFactory =  require('../middleware/factory');

class ExtractTransform extends Transform{
    constructor (config) {
        super(config);
        this.lines = 0;
        this.chain = [];
        this.index = 0;

        var configs = this.config.middleware || [];
        // 获取middlewares config
        configs.forEach(config => {
            // 创建middleware
            var middleware = MiddleWareFactory.create(config.module, config);
            this.use(middleware);
        });
    }
    _transform (buffer, encoding, callback) {
        this.lines ++;
        this.index = 0;

                // next = middleware.handle(rs, next);
                // 
                // if (Array.isArray(rs)) {
                //     if (middleware.config.input === "element"){
                //         var arr = [];
                //         rs.forEach(element => {
                //             var ele = middleware.handle(element);
                //             if (ele !== false) {
                //                 arr.push(ele);
                //             }
                //         });
                //         rs = arr;
                //     } else {
                //         rs = middleware.handle(rs);
                //     }
                // } else {
                //     rs = middleware.handle(rs);
                // }

        console.log('final',this.next(buffer));
        // if (data) {
        //     this.push(data);
        // }
        console.log('------------');
        callback();
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
    }
    use (middleware) {
        this.chain.push(middleware);
    }
    next (data) { //当调用next时执行index所指向的中间件
        if (this.index >= this.chain.length){
            console.log('end');
            return data;
        }
        let middleware = this.chain[this.index];
        console.log('P',this.index);
        this.index++;
        return middleware.handle(data, this.next.bind(this));
    }
}




module.exports = ExtractTransform;