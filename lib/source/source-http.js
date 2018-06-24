/*
 * @Author: qiansc 
 * @Date: 2018-04-10 16:23:15 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-11 00:27:52
 */
var http = require('http')
var qs=require('querystring');
var Connector = require('../pipeline/connector');
var Log =require('../util/log');
var Source = require('../source/source');
var file = require('../util/file');
var RangeFormatter = require('../formatter/formatter-range');
var log = new Log(5);

class HttpSource extends Source{
    constructor(config){
        super(config);
    }

    createReadStream (option){
        var self = this;
        // writer 为目标可写流
        var connector = new Connector();

        requestParam = this.getRequestParam(this.config, option);
        
        var req = http.request(requestParam, function(res) { 
            log.info('L8', 'STATUS: ' + res.statusCode); 
            log.info('L8', 'HEADERS: ' + JSON.stringify(res.headers)); 
            res.setEncoding('utf8');
            // 定向到控制台

            res.pipe(connector);
            res.on('end', function(){
                self.emit('end', self);
            });
        }); 

        req.on('error', function(e) { 
            log.warn('problem with request: ' + e.message); 
        });
        log.info('L5', 'FROM\t' , requestParam.hostname + ':' + requestParam.port + requestParam.path);
        req.end();
        return connector;
    }
    getRequestParam(config, option) {
        // 获取http请求的参数
        var param = {};
        
        if(option.range) {
            var requestParamFormatter = new RangeFormatter(option.range);
            param = requestParamFormatter.format(config.param || {}, ap);
        }
        
        return  {
            hostname: config.host, 
            port: config.port, 
            path: config.path + '?' + qs.stringify(param),
            method: config.method || 'GET'
        };
    }
}
module.exports = HttpSource;