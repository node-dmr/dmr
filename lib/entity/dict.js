/*
 * @Author: qiansc 
 * @Date: 2018-07-18 14:26:14 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-07-18 18:25:09
 */
const fs = require('fs');  

class Dict {
    constructor (options) {
        this.options = options = Object.assign({
            encoding: 'utf-8',
            "line-break": '\n'
        }, options)
        this.text = fs.readFileSync(options.filePath, {
            encoding: options.encoding
        });
        if (this.text && this.text.length > 0) {
            this.loaded = true;
        }
    }
    each(fn) {
        this.text.split(this.options["line-break"]).forEach(element => {
            return fn(element);
        });
    }
}
module.exports = Dict;