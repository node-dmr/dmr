/*
 * @Author: qiansc 
 * @Date: 2018-04-02 11:18:49 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-09 21:44:26
 */

var Log = require('../packages/util/log');
var log = new Log(2);

var program = require('commander');
var path = require('path');
var Range = require('../packages/util/range');
var Time = require('../packages/util/time');
var ImportTask = require('../packages/task/import-task');

program
  .version('0.1.0', '-v, --version')
  .option('-i, --id <value>', 'Task ID')
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
    log.info('    $ download -i search_ac -s 20180401.1200.00 -e 20180401120010');
    log.info('    $ download -i search_ac -s 20180401.1200.00 -r 10s');
    log.info('    $ download -i search_ac -s 20180401120000 -r 10s -f ./rs.log');
    log.info('    $ download -i search_ac -s -5m -r 10s');
    log.info('    $ download -i search_ac -s -5m -r 10s -l 0');
    log.info('    $ download -i search_ac -s -5m -r 10s -p speedup-ace ');
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

var taskId = program.id || false;
var startDatetime = program.start || false;
var endDatetime = program.end || false;
var rangeString = program.range || false;
var file = program.file || false;
var range = new Range();
var importTask;
/**
 *  参数选项验证
 */
if (!taskId){
    log.info('Task ID is required!');
    return;
} else {
    importTask = new ImportTask(taskId);
}

if (startDatetime) {
    if (startDatetime.toString().indexOf('-') === 0) {
        var prev = Time.parseInterval(startDatetime);
        startDatetime =  new Date(new Date().getTime() + prev * 1);
    } else {
        startDatetime = Time.fillDatetime(startDatetime.replace(/[\-\:\\]/g,''));
        startDatetime = Time.parseDatetime(startDatetime, 'HHHHMMDDhhmmss');
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
    endDatetime = Time.fillDatetime(endDatetime.replace(/[\-\:\\]/g,''));
    endDatetime = Time.parseDatetime(endDatetime, 'HHHHMMDDhhmmss');
    range.setEndDatetime(endDatetime);
}
if (rangeString) {
    if (rangeString === "default"){
        if (importTask.taskConfig.interval){
            // 如果默认配置有interval
            rangeString = importTask.taskConfig.interval;
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
    importTask.setFilePath('default');
    log.info('FilePath ', 'Use TaskConfig');
} else if (file){
    // 从当前命令执行路径计算目标路径，会覆盖task默认file
    file = path.resolve(process.cwd(), file);
    importTask.setFilePath(file);
    log.info('filePath ', importTask.getFilePath());
}
if (program.project) {
    log.info('Specify Project >>> ' + program.project);
}
// log.groupEnd();
log.info('------------------------------------------------------------------------');
log.info('');

importTask.setParams({
    "starttimestamp": range.startTimeStamp,
    "endtimestamp": range.endTimeStamp
});
importTask.start();


/**
 *  部分批处理函数 
 */
function range(val) {
    return val.split('..').map(Number);
}
function list(val) {
    return val.split(',');
}