/*
 * @Author: qiansc 
 * @Date: 2018-04-10 16:23:15 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-13 12:22:55
 */
var http = require('http')
var qs=require('querystring');
var Log =require('../util/log');
var Source = require('../core/source');
var file = require('../util/file');
var log = new Log(5);

class HttpSource extends Source{
    constructor(config){
        super(config);
        this.requestParamFormatter;
    }

    createReadStream (requestParam){
        var self = this;
        // writer 为目标可写流
        requestParam = requestParam || this.getRequestParam();
        var req = http.request(requestParam, function(res) { 
            log.info('L8', 'STATUS: ' + res.statusCode); 
            log.info('L8', 'HEADERS: ' + JSON.stringify(res.headers)); 
            res.setEncoding('utf8');
            // 定向到控制台
            if (self.output) {
                res.pipe(self.output);
            }
            res.on('end', function(){
                self.emit('end', self.output);
            });
        }); 

        req.on('error', function(e) { 
            log.warn('problem with request: ' + e.message); 
        });

        log.info('L5', '[from] ' , requestParam.hostname + ':' + requestParam.port + requestParam.path);
        req.end();

        return this;
    }
    setRequestParamFormatter (formatter){
        this.requestParamFormatter = formatter;
    }
    getRequestParam() {
        // 获取http请求的参数
        var config = this.config || {};
        var param = this.requestParamFormatter.format(config.param || {}, this.option);
        return  {
            hostname: config.host, 
            port: config.port, 
            path: config.path + '?' + qs.stringify(param),
            method: config.method || 'GET'
        };
    }
}
module.exports = HttpSource;