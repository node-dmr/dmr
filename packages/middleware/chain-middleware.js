/*
 * @Author: qiansc 
 * @Date: 2018-04-20 19:08:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-23 15:05:25
 */
var Middleware = require('../middleware/middleware');

class ChainMiddleware extends Middleware{
    constructor (config) {
        super(config);
        this.chain = [];
        this.index = 0;
        // 在初始化时候引入Factory，否则会存在循环依赖
        var MiddleWareFactory =  require('../middleware/factory');

        var chains = this.config.chains || [];
        // 获取middlewares config
        chains.forEach(middlewareConfig => {
            // 创建middleware
            var middleware = MiddleWareFactory.create(middlewareConfig.module, middlewareConfig);
            this.use(middleware);
        });
    }
    handle (data, next) {
        this.index = 0;
        // 开始链式调用middleware
        var result = this.next(data);
        return next(result);
    }
    use (middleware) {
        this.chain.push(middleware);
    }
    next (data) { //当调用next时执行index所指向的中间件
        if (this.index >= this.chain.length){
            return data;
        }
        // console.log(this.index);
        let middleware = this.chain[this.index];
        // console.log('P',this.index);
        this.index++;
        return middleware.handle(data, this.next.bind(this));
    }
}

module.exports = ChainMiddleware;