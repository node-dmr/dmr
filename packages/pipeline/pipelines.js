/*
 * @Author: qiansc 
 * @Date: 2018-04-10 17:02:27 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-02 20:04:33
 */
var PipelineFactory = require('../pipeline/factory');
var ActionImplements = require('../core/action-implements');

class Pipelines{
    constructor (config){
        // super();
        this.config = config;
        ActionImplements.applyOn(this);
        
        // output-reader
        this.readable = null;
        // input-writer
        this.writeable = null;
    }
    create (){
        let config = this.config;
        let actionParam = this.actionParam;
        config.forEach((item, index) => {
            let pipeline = PipelineFactory.create(item);
            if (pipeline.setActionParam) {
                pipeline.setActionParam(actionParam);
            }
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