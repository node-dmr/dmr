/*
 * @Author: qiansc 
 * @Date: 2018-04-03 11:13:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-03 15:11:12
 */
var Client = require('ftp');
var http = require('http');
var fs = require('fs');
var qs=require('querystring');
var Log =require('../util/log');
var log = new Log(5);

module.exports =  downloadTask;

function downloadTask(){

}

downloadTask.prototype.start = function(range){
    
    log.info('downloadTask start!');
    var data = {
        starttimestamp: Math.round(range.startTimeStamp/1000),
        endtimestamp: Math.round(range.endTimeStamp/1000),
        from: 'search_ac.log,get_doc_ac.log',
        conditions: 'search_ac.log:index_for_speed,1,==;get_doc_ac.log:index_for_speed,1,==',
        type: 'logs',
        flow: 'wise',
        idc: 'tc',
        code: 'txt'
    }
    http_download(data);




    // var c = new Client();
    // c.on('ready', function() {
    //   c.get('gzhl-ps-201706-m22-www1659.gzhl:8082/',
    //   function(err, stream) {
    //     if (err) throw err;
    //     stream.once('close', function() { c.end(); });
    //     stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
    //   });
    // });
    // // connect to localhost:21 as anonymous
    // c.connect();
}

function http_download(data){
    var options = {
        hostname: 'gzhl-ps-201706-m22-www1659.gzhl', 
        port: 8082, 
        path: '/ligo/beidou?' + qs.stringify(data),
        method: 'GET' 
    }; 
    log.info('L9', 'url:', options.hostname + options.path);
    var req = http.request(options, function(res) { 
        log.info('L8', 'STATUS: ' + res.statusCode); 
        log.info('L8', 'HEADERS: ' + JSON.stringify(res.headers)); 
        res.setEncoding('utf8'); 
        res.on('data', function (chunk) { 
            log.info('L9', chunk.length); 
        }); 
        res.on('end', () => {
            log.info('L8', '---------------------END-----------------------');
        });
    }); 
            
    req.on('error', function(e) { 
        log.info('problem with request: ' + e.message); 
    });
    log.info('L8', '--------------------START----------------------'); 
    req.end();
}