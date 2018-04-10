/*
 * @Author: qiansc 
 * @Date: 2018-04-10 16:23:15 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 17:40:02
 */
var Log =require('../util/log');
var config = require('../core/config');
var Source = require('../core/source');
var Time = require('../util/time');
var dtpl= require('../util/data-template');
var file = require('../util/file');
var http = require('http');
var fs  = require('fs');
var qs=require('querystring');
var path = require('path');

var log = new Log(5);

class HttpSource extends Source{
    constructor(sourceConfig){
        super(sourceConfig);
    }
    saveTo (filePath){
        var filePathParam = Time.parseParam(
            new Date(this.param.starttimestamp),
            new Date(this.param.endtimestamp)
        );
        this.filePath = dtpl(filePath, filePathParam);
    }
    start (){
        var sourceConfig = this.sourceConfig || {};
        var paramTemplate = sourceConfig.param || {};
        var param = dtpl(paramTemplate, this.param);
        var filePath = this.filePath;
        var requestParam = {
            hostname: sourceConfig.host, 
            port: sourceConfig.port, 
            path: sourceConfig.path + '?' + qs.stringify(param),
            method: sourceConfig.method || 'GET'
        };
        var writer;
        log.info('L5', '[from] ' , requestParam.hostname + ':' + requestParam.port + requestParam.path);

        if (filePath) {
            // 获取文件目录，不存在则创建
            var baseUrl = path.dirname(filePath);
            if (!fs.existsSync(baseUrl)) {
                file.mkdirsSync(baseUrl);
            }
            
            //创建writer
            var writer = fs.createWriteStream(filePath, {
                encoding: 'utf8'
            });
            log.warn('L1', '[ to ] ' , filePath);
        }
        
        // return;
        var req = http.request(requestParam, function(res) { 
            log.info('L8', 'STATUS: ' + res.statusCode); 
            log.info('L8', 'HEADERS: ' + JSON.stringify(res.headers)); 
            
            res.setEncoding('utf8');
            
            res.on('data', function (chunk) {
                    if (writer){
                        writer.write(chunk);
                    } else {
                        // 直接打印至控制台
                        log.info('L0', chunk); 
                    }
                
            });
    
            res.on('end', () => {
                log.info('L8', '---------------------END-----------------------');
                if (writer) {
                    writer.end();
                }
            });
        }); 
                
        req.on('error', function(e) { 
            log.warn('problem with request: ' + e.message); 
        });
        log.info('L8', '--------------------START----------------------'); 
        req.end();
    }
}
module.exports = HttpSource;