/*
 * @Author: qiansc 
 * @Date: 2018-04-27 16:58:06 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-27 16:59:35
 */

var http = require('http');

 class Server {


    start () {
        http.createServer(function(request, response){
            response.writeHead(200, { 'Content-Type': 'text-plain' });
            response.end('Hello World\n');
        }).listen(8124);
        
    }
 }

 module.exports = Server;