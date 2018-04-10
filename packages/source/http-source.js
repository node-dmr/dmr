/*
 * @Author: qiansc 
 * @Date: 2018-04-10 16:23:15 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 21:01:37
 */
var Log =require('../util/log');
var config = require('../core/config');
var Source = require('../core/source');
var Time = require('../util/time');
var dtpl= require('../util/data-template');
var file = require('../util/file');
var http = require('http')
var qs=require('querystring');
var log = new Log(5);

class HttpSource extends Source{
    constructor(sourceConfig){
        super(sourceConfig);
    }

    request (){
        var self = this;
        // writer 为目标可写流
        var writer = this.output;
        var requestParam = this.getRequestParam();
        
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
        var sourceConfig = this.sourceConfig || {};
        var paramTemplate = sourceConfig.param || {};
        var param = dtpl(paramTemplate, this.param);
        return  {
            hostname: sourceConfig.host, 
            port: sourceConfig.port, 
            path: sourceConfig.path + '?' + qs.stringify(param),
            method: sourceConfig.method || 'GET'
        };
    }
}
module.exports = HttpSource;