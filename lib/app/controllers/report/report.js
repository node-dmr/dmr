/*
 * @Author: qiansc 
 * @Date: 2018-06-25 13:17:23 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-29 01:32:27
 */
const fs = require('fs');
const Config = require('../../../core/config');
const Range = require('../../../util/range');
const RangeFormatter = require('../../../formatter/formatter-range');
const Controller = require('../controller');
const Conditions =  require('../../model/query-conditions');
const Report =  require('../../model/report');
const Table =  require('../../model/table');
const DimChainedsProvider =  require('../../model-provider/dim-chaineds');
const ResponseJson = require('../../model/response-json');
const DimChained = require('../../model-provider/dim-chained');
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
            intervals = intervals || [config["interval"] || config["input-interval"]];
            intervals.forEach(interval => {
                let ranges = range.split(interval);
                ranges.forEach((r, index) => {
                    let report = new Report({
                        taskid: taskid,
                        range: r
                    });
                    // 报表存在时
                    if(report.existsSync()) {
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
                            value: JSON.stringify(r.param())
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
    
    getDimChaineds(req, res, next) {
        let query = req.query || {};
        let dconditions = new Conditions(query.dimconditions || []);
        let conditions = new Conditions(query.conditions || []);
        let rej = new ResponseJson();
        let report = new Report({
            taskid: query.task,
            range: new Range(JSON.parse(conditions.val('range')))
        });
        if(!report.existsSync()) {
            rej.err('no such report!');
            res.send(rej.get());
            return;
        }
        let dimParten = dconditions.param();
        let matchedDims = {};
        let stream = report.createStream();
        stream.on('data', result => {
            let dim = new Dim(result.get('key'));
            let matchedDim = dim.match(dimParten);
            if (matchedDim) {
                matchedDims[JSON.stringify(matchedDim)] = true;
            }
        });
        stream.on('end', () => {
            let dims = [];
            Object.keys(matchedDims).forEach(dim => {
                dims.push(JSON.parse(dim));
            });
            // [ { idc: 'all', format: 'all' } , ...]
            rej.set('data', DimChainedsProvider.produce(dims, dconditions.keys()));
            res.send(rej.get());
        });
    }


    getTable(req, res, next) {
        let query = req.query || {};
        let conditions = new Conditions(query.conditions || []);
        let rej = new ResponseJson();
        let report = new Report({
            taskid: query.task,
            range: new Range(JSON.parse(conditions.val('range')))
        });
        if(!report.existsSync()) {
            rej.err('no such report!');
            res.send(rej.get());
            return;
        }
        let dimchained = conditions.val('dimchained'), dimParten = {};
        if (dimchained) {
            dimParten = DimChained.produce(dimchained);
        }
        let stream = report.createStream();
        let config = JSON.parse(req.query.config) || {"row": "field","columns": ["calculate", "value"]};
        config.dimParten = dimParten;
        let table = new Table(config);
        table.readReport({
            stream: stream
        });
        // table.readReport({
        //     stream: report.createStream(),
        //     alias: {'value': 'value1'}
        // });
        // {"row":"value","columns":[""]}

        
        res.send(rej.get());
    }
}
module.exports = ReportController;