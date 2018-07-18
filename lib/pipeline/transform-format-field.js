/*
 * @Author: qiansc 
 * @Date: 2018-04-13 16:36:33 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-07-18 11:24:08
 */

const Transform = require('../pipeline/transform');

class ExtractTransform extends Transform{
    constructor (config) {
        config.objectMode = true;
        super(config);
        this.oprates = [];
        if (config.decodeURIComponent) {
            let dc = {
                fn: function(result) {
                    if (dc.fields === "all") {
                        dc.fields = result.keys();
                    }
                    dc.fields.forEach(field => {
                        // console.log(result.get(field));
                        if (result.get(field) !== undefined) {
                            try {
                                let decode = decodeURIComponent(result.get(field));
                                result.set(field, decode);
                            } catch(e) {
                                // do nothing
                            }
                        }
                    });
                    return result;
                },
                fields: config.decodeURIComponent
            };
            this.oprates.push(dc);
        }
    }
    _transform(result, encoding, callback){
        this.oprates.forEach(op => {
            result =  op.fn(result);
        });
        this.push(result);
        callback();
    }
}

module.exports = ExtractTransform;