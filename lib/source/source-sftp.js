/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-11 08:19:40
 */
var Connector = require('../pipeline/connector');
let Client = require('ssh2-sftp-client-fast');
var Log =require('../util/log');
var Source = require('../source/source');
var file = require('../util/file');
var RangeFormatter = require('../formatter/formatter-range');
var log = new Log(5);

class FtpSource extends Source{
    constructor(config){
        super(config);
    }

    createReadStream (option){
        var self = this;
        // writer 为目标可写流
        var connector = new Connector();

        var rangeFormatter = new RangeFormatter(option.range);
        var path = rangeFormatter.format(this.config.path);
        let sftp = new Client();
        log.info('L5', 'FROM\t' , 'ftp://' + this.config.host + ':' + this.config.port + path);
        sftp.connect({
            host: this.config.host,
            port: this.config.port,
            username: this.config.username || '',
            password: this.config.password || ''
        });

        // client.on('ready', function() {
        //     client.get(path, function(err, stream) {
        //     if (err) throw err;
        //     stream.pipe(connector);
        //     stream.on('close', function() {
        //         client.end();
        //         self.emit('end', self);
        //     });
        //   });
        // });
        
        
        return connector;
    }
}

module.exports = FtpSource;