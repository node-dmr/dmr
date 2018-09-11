/*
 * @Author: qiansc
 * @Date: 2018-09-12 01:12:32
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-12 01:33:05
 */
const Source = require('dmr-source');

class SourceFactory {
    /**
     * SourceFactory
     * @param  {Object} config
     * @param  {String} config.source
     */
    static create(config){
        switch(config.source){
            case "HttpSource":
            case "http":
                return new Source.HttpSource(config);
            case "FileSource":
            case "file":
                return new Source.FileSource(config);
            case "FtpSource":
            case "ftp":
                return new Source.FtpSource(config);
            default:
                break;
        }
    }
}

module.exports = SourceFactory;
