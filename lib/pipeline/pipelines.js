/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-03 19:48:27
 */
var PipelineFactory = require('../pipeline/factory');
// var ActionImplements = require('../core/action-implements');

class Pipelines{
    constructor (config){
        // super();
        this.config = config;
        
        // output-reader
        this.readable = null;
        // input-writer
        this.writeable = null;
    }
    create (option){
        let config = this.config;
        config.forEach((item, index) => {
            let pipeline = PipelineFactory.create(item);
            pipeline.emit('option', option);
            
            if (this.readable) {
                this.readable.pipe(pipeline);
            } else {
                this.writeable = pipeline;
            }
            this.readable = pipeline;
        });

        return this;
    }
    _transform(chunk, encoding, callback){
        this.push(chunk);
        callback();
    };
}

module.exports = Pipelines;