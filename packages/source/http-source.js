/*
 * @Author: qiansc 
 * @Date: 2018-04-10 16:23:15 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-11 16:58:10
 */
var Log =require('../util/log');
var Source = require('../core/source');
var Time = require('../util/time');
var dtpl= require('../util/data-template');
var file = require('../util/file');
var http = require('http')
var qs=require('querystring');
var log = new Log(5);

class HttpSource extends Source{
    constructor(config){
        super(config);
    }

    request (requestParam){
        var self = this;
        // writer 为目标可写流
        var writer = this.output;
        requestParam = requestParam || this.getRequestParam();
        
        var req = http.request(requestParam, function(res) { 
            log.info('L8', 'STATUS: ' + res.statusCode); 
            log.info('L8', 'HEADERS: ' + JSON.stringify(res.headers)); 
            res.setEncoding('utf8');
            // 定向到控制台
            if (writer) {
                res.pipe(writer);
            }
            res.on('end', function(){
                self.emit('end', writer);
            });
        }); 

        req.on('error', function(e) { 
            log.warn('problem with request: ' + e.message); 
        });

        log.info('L5', '[from] ' , requestParam.hostname + ':' + requestParam.port + requestParam.path);
        req.end();

        return this;
    }

    getRequestParam() {
        // 获取http请求的参数
        var config = this.config || {};
        var paramTemplate = config.param || {};
        var param = dtpl(paramTemplate, this.option);
        return  {
            hostname: config.host, 
            port: config.port, 
            path: config.path + '?' + qs.stringify(param),
            method: config.method || 'GET'
        };
    }
}
module.exports = HttpSource;