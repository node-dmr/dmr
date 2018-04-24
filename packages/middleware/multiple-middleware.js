/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 22:28:07
 */
var Middleware = require('../middleware/middleware');

class MultipleMiddleware extends Middleware{
    constructor (config) {
        super(config);
        this.type = null;
        this.middlewares = [];
        // 在初始化时候引入Factory，否则会存在循环依赖
        var MiddleWareFactory =  require('../middleware/factory');

        var middlewareConfig = this.config.each;
        if (!middlewareConfig){
            throw new Error('SeparateMiddleware need middleware configs!');
        } else if (Array.isArray(middlewareConfig)){
            this.type = 'middlewares';
            middlewareConfig.forEach(conf => {
                if(conf && conf.module){
                    // 创建middleware
                    var middleware = MiddleWareFactory.create(conf.module, conf);
                    this.middlewares.push(MiddleWareFactory.create(conf.module, conf));
                } else {
                    this.middlewares.push(null);
                }
            });
        } else if (middlewareConfig.module) {
            this.type = 'middleware';
            this.middlewares.push(MiddleWareFactory.create(middlewareConfig.module, middlewareConfig));
        }
    }
    handle (data, next) {
        var result = [];
        if(!Array.isArray(data)){
            // throw new Error('input data should be an Array!');
            return next(false);
        } else if(this.type){
            data.forEach((element, index) => {
                let cursor = 0;
                if (this.type == "middlewares") {
                    cursor = index;
                    // console.log(cursor,this.middlewares.length);
                }
                let middleware = this.middlewares[cursor];
                if (middleware) {
                    middleware.handle(element,function(ele){
                        if (ele) result.push(ele);
                    });
                }
            });
        }
        // if (this.type == "middlewares") {
        // }
        return next(result);
        
    }
}

module.exports = MultipleMiddleware;