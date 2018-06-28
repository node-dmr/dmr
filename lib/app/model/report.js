/*
 * @Author: qiansc 
 * @Date: 2018-06-27 19:38:05 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-29 01:08:16
 */
const fs = require('fs');
const Config = require('../../core/config');
const SourceFile = require('../../source/source-file');
const LineTransform = require('../../pipeline/transform-line');
const TableParser = require('../../pipeline/transform-table').Parser;

class report {
    constructor(option) {
        this.option = option = option || {};
        if (option.taskid) {
            let config = Config.find('task',option.taskid)["output-source"];
            this.source = new SourceFile(config);
        }
    }
    existsSync() {
        if (!this.source) return false;
        let file = this.source.getFile({range: this.option.range.param()});
        return !!fs.existsSync(file);
    }
    createStream(config) {
        config = config || {};
        let stream = this.source.createReadStream({range: this.option.range.param()});
        let transform = new LineTransform();
        let parser = new TableParser();
        let reader = stream.pipe(transform).pipe(parser);
        return reader;
    }
}

module.exports = report;