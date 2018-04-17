/*
 * @Author: qiansc 
 * @Date: 2018-04-02 11:18:49 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 15:30:56
 */

var Log = require('../packages/util/log');
var log = new Log(2);

var program = require('commander');
var path = require('path');
var Range = require('../packages/util/range');
var TimeFormatter = require('../packages/formatter/time-formatter');
var TaskFactory = require('../packages/core/task-factory');
var Action = require('../packages/core/Action');

program
  .version('0.1.0', '-v, --version')
  .option('-t, --task <value>', 'Task ID')
  .option('-s, --start <items>', 'Start Date / Datetime')
  .option('-e, --end <items>', 'End Date / Datetime')
  .option('-r, --range <value>', 'Ranges(d,h,m,s) [option]')
  .option('-f, --file <file>', 'Output File [option]')
  .option('-l, --log <value>', 'Log Output Level Since Less to All( 0 ~ 9 )')
  .option('-p, --project <value>', 'Specify Project');

program.on('--help', function(){
    log.info('');
    log.info('  Examples:');
    log.info('');
    log.info('    $ import -t search_ac -s 20180401.1200.00 -e 20180401120010');
    log.info('    $ import -t search_ac -s 20180401.1200.00 -r 10s');
    log.info('    $ import -t search_ac -s 20180401120000 -r 10s -f ./rs.log');
    log.info('    $ import -t search_ac -s -5m -r 10s');
    log.info('    $ import -t search_ac -s -5m -r 10s -l 0');
    log.info('    $ import -t search_ac -s -5m -r 10s -p speedup-ace ');
    log.info('');
    log.info('  Supported Task:');
    log.info('');
    log.info('    search_ac      search_ac.log');
    log.info(' ');
});

program.parse(process.argv);

if (program.log !== undefined){
    Log.setGlobalLev(program.log);
}

var taskId = program.task || false;
var startDatetime = program.start || false;
var endDatetime = program.end || false;
var rangeString = program.range || false;
var file = program.file || false;
var range = new Range();
var action = new Action();
/**
 *  参数选项验证
 */
if (!taskId){
    log.info('Task ID is required!');
    return;
} else {
    var taskConfig = TaskFactory.getConfig('import', taskId);
}

if (startDatetime) {
    if (startDatetime.toString().indexOf('-') === 0) {
        var prev = TimeFormatter.parseInterval(startDatetime);
        startDatetime =  new Date(new Date().getTime() + prev * 1);
    } else {
        startDatetime = TimeFormatter.fillDatetime(startDatetime.replace(/[\-\:\\]/g,''));
        startDatetime = TimeFormatter.parseDatetime(startDatetime, 'HHHHMMDDhhmmss');
    }
    range.setStartDatetime(startDatetime);
} else {
    log.info('Start Date / Datetime is required!');
    return;
}
if((endDatetime && rangeString) || (!endDatetime && !rangeString)) {
    log.info('You Should choose Option between  End Datetime / Ranges!');
    return;
}
if (endDatetime) {
    endDatetime = TimeFormatter.fillDatetime(endDatetime.replace(/[\-\:\\]/g,''));
    endDatetime = TimeFormatter.parseDatetime(endDatetime, 'HHHHMMDDhhmmss');
    range.setEndDatetime(endDatetime);
}
if (rangeString) {
    if (rangeString === "default"){
        if (taskConfig.interval){
            // 如果默认配置有interval
            rangeString = taskConfig.interval;
        } else {
            log.info('No Default Interval Config Of Range!');
        }
    }
    range.setInterval(rangeString);
}

/**
 *  校验成功后的命令提示
 */
log.info('------------------------------------------------------------------------');
// log.group('    ');
log.info('You will start a downlaod job with:');
log.info('');
if (taskId) log.info('Task', taskId);
log.info('' + range.toString('\r\n'));
if (file == "default") {
    action.set("file", "default");
    log.info('FilePath ', 'Use TaskConfig');
} else if (file){
    // 从当前命令执行路径计算目标路径，会覆盖task默认file
    file = path.resolve(process.cwd(), file);
    action.set('file', file);
    //log.info('FilePath ', file);
}
if (program.project) {
    log.info('Specify Project >>> ' + program.project);
}
// log.groupEnd();
log.info('------------------------------------------------------------------------');
log.info('');

action.set('range', range.param());
action.set('task-type', "import");
action.set('task-id', taskId);

var task = TaskFactory.create(action);
task.run();

/**
 *  部分批处理函数 
 */
function range(val) {
    return val.split('..').map(Number);
}
function list(val) {
    return val.split(',');
}