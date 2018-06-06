/*
 * @Author: qiansc 
 * @Date: 2018-04-26 00:12:28 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-03 15:26:44
 */
var Transform = require('../pipeline/transform');
var DimFactory = require('../entity/dimFactory');
var Result = require('../entity/result');
var util = require('util');

class ExportTransform extends Transform{
    constructor (config) {
        config.readableObjectMode = true;
        config.writableObjectMode = true;
        super(config);
        this.df = new DimFactory(config.dims);
        this.linefields = null;
        this.dimfields = new Array((config.dims|| []).length);
        this._preporcess();
    }
    _transform(result, encoding, callback){
        let dims = this.df.deal(result);
        // once make calfields
        this.linefields = this.linefields || this.config.fields || result.keys();
        dims.forEach((dim, index) => {
            let fields = this.dimfields[index] || this.linefields;
            fields.forEach(field => {
                dim.set('field', field);
                let pair = new Result();
                pair.set('key', dim.stringfy());
                pair.set('value', result.get(field));
                this.push(pair);
            });

        });
        callback();
    }
    _preporcess () {
        Object.keys(this.config).forEach(key => {
            let matches = key.match(/^dim-([^-]*)-fields$/);
            if (matches && matches[1]) {
                if(matches[1].match(/^\d+$/)) {
                    this.dimfields[matches[1] * 1] = this.config[key];
                    return;
                }
                // arr = ["1","2","3~8","9"]
                let arr = matches[1].split(',');
                arr.forEach(a => {
                    if (a.match(/^\d+$/)){
                        this.dimfields[a * 1] = this.config[key];
                        return;
                    }
                    let mr = a.match(/^(\d+)\~(\d+)$/);
                    if (mr) {
                        for (let i = mr[1] * 1; i <= mr[2] *1; i++ ) {
                            this.dimfields[i] = this.config[key];
                        }
                    }
                });
            }
        });
    }
}

module.exports = ExportTransform;