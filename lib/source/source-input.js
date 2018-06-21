/*
 * @Author: qiansc 
 * @Date: 2018-05-12 10:50:36 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-21 23:03:22
 */
/*
 * @Author: qiansc 
 * @Date: 2018-04-11 19:57:16 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-11 08:19:40
 */
var Connector = require('../pipeline/connector');
var Source = require('../source/source');
var Range = require('../util/range');
var TimeFormatter = require('../formatter/formatter-time');
var SourceFactory = require('../source/factory');

class InputSource extends Source{
    constructor(config){
        super(config);
    }
    setInterval (interval) {
        if (interval) {
            this.interval = TimeFormatter.parseInterval(interval, 'ms');
        }
    }
    createReadStream (option){
        let self = this;
        // writer 为目标可写流
        let connector = new Connector();
        let ranges = new Range(option.range).split(this.interval);
        this.options = [];
        ranges.forEach((range, index) => {
            this.options.push(Object.assign({}, option, {
                range: range.param()
            }));
        });
        next();

        function next(){
            let source = SourceFactory.create(self.config);
            source.on('create', function (file) {
                self.emit('create', file);
            });
            let reader = source.createReadStream(self.options.shift());
            let end = !self.options.length;
            reader.pipe(connector,{
                end : end
            });
            if (!end) {
                reader.on('end', function(){
                    connector.unpipe(reader);
                    next();
                });
            }
        }
        // console.log(option.range, this.interval);

        return connector;
    }
}

module.exports = InputSource;