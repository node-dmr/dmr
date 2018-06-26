/*
 * @Author: qiansc 
 * @Date: 2018-06-25 13:17:23 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-26 14:47:08
 */
const fs = require('fs');
const Controller = require('../controller');
const Conditions =  require('../../model/conditions');
const Config = require('../../../core/config');
const SourceFile = require('../../../source/source-file');
const Range = require('../../../util/range');
const RangeFormatter = require('../../../formatter/formatter-range');
const ResponseJson = require('../../model/response-json');
const LineTransform = require('../../../pipeline/transform-line');
const TableParser = require('../../../pipeline/transform-table').Parser;
const Dim = require('../../../entity/dim');

class ReportController extends Controller{
    constructor () {
        super();
    }
    getAvailableRanges(req, res, next) {
        let query = req.query || {};
        let conditions = new Conditions(query.conditions || []);
        let interval = JSON.parse(query.interval || null);
        let intervals =  interval? [interval] : JSON.parse(query.intervals || null);
        let taskid = query.task;
        let startdate = conditions.val('startdate');
        let rej = new ResponseJson(), data = [];
        let range = new Range();
        range.setStartDatetime(new Date(startdate + ' 00:00:00'));
        range.setInterval(query.range || '1d');
        if (taskid) {
            let config = Config.find('task',taskid)["output-source"];
            let source = new SourceFile(config);
            intervals = intervals || [config["interval"] || config["input-interval"]];
            intervals.forEach(interval => {
                let ranges = range.split(interval);
                ranges.forEach((r, index) => {
                    let file = source.getFile({range: r});
                    // 报表存在时
                    if(fs.existsSync(file)) {

                        let formatter = new RangeFormatter(r);
                        let rp = formatter.toParam();
                        let tpl = '{$hh}:{$mm}:{$ss} {$interval.s}s';
                        if (rp.interval.auto === 'd') {
                            tpl = '{$MM}-{$DD} {$interval.h}h';
                        } else if (rp.interval.auto === 'h') {
                            tpl = '{$MM}-{$DD} {$hh} {$interval.h}h';
                        } else if (rp.interval.auto === 'h') {
                            tpl = '{$MM}-{$DD} {$hh}:{$mm} {$interval.m}m';s
                        }
                        data.push({
                            name: formatter.format(tpl),
                            value: r.param()
                        });
                    }
                });
            });
        } else {
            rej.err('please set taskid!');
        }
        rej.set('data', data);
        res.json(rej.get());
    }
    
    getChainDims(req, res, next) {
        let query = req.query || {};
        let dconditions = new Conditions(query.dimconditions || []);
        let taskid = query.task;
        let conditions = new Conditions(query.conditions || []);
        let rangeString = conditions.val('range');
        let range = new Range(rangeString);
        let rej = new ResponseJson(), data = [];
        
        if (taskid) {
            let config = Config.find('task',taskid)["output-source"];
            let source = new SourceFile(config);
            let file = source.getFile({range: range.param()});
            let dp = dconditions.param();
            // 报表存在时
            if(!fs.existsSync(file)) {
                rej.err('no such report!');
                res.send(rej.get());
                return;
            }
            let dims = {};
            let stream = source.createReadStream({range: range.param()});
            let transform = new LineTransform();
            let parser = new TableParser();
            stream.pipe(transform).pipe(parser);
            parser.on('data', result => {
                let dim = new Dim(result.get('key'));
                let matched = dim.match(dp);
                if (matched) {
                    dims[JSON.stringify(matched)] = true;
                }
                // data.push(result);
            });
            parser.on('end', () => {
                let _dims = [];
                Object.keys(dims).forEach(dim => {
                    _dims.push(JSON.parse(dim));
                });
                // let chain = new Chain(dims, dconditions.keys());
                // dconditions.keys().forEach(key => {

                // });
                rej.set('data', _dims);
                res.send(rej.get());
            });
            
        } else {
            rej.err('please set taskid!');
            res.send(rej.get());
        }
    }
}

module.exports = ReportController;