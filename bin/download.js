/*
 * @Author: qiansc 
 * @Date: 2018-04-02 11:18:49 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-04 18:41:51
 */

var Log = require('../packages/util/log');
var log = new Log(2);

var program = require('commander');
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
    log.info('    $ dowload -i search_ac -start 20180401.1200.00 -e 20180401120010');
    log.info('    $ dowload -i search_ac -start 20180401.1200.00 -r 10s');
    log.info('    $ dowload -i search_ac -start 20180401120000 -r 10s -f ./rs.log');
    log.info('    $ dowload -i search_ac -start -5m -r 10s');
    log.info('    $ dowload -i search_ac -start -5m -r 10s -l 0');
    log.info('    $ dowload -i search_ac -start -5m -r 10s -p speedup-ace ');
    log.info('');
    log.info('  Supported Task:');
    log.info('');
    log.info('    search_ac      search_ac.log');
    log.info(' ');
});

if (program.project) {

}
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
/**
 *  参数选项验证
 */
if (!taskId){
    log.info('Task ID is required!');
    return;
} else if (!ImportTask.exist(taskId)){
    log.info('Task Config is not exist!');
    return;
}

if (startDatetime) {
    if (startDatetime.toString().indexOf('-') === 0) {
        var prev = Time.parse(startDatetime);
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
    range.setRange(rangeString);
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
if (file) log.info('file', file);
// log.groupEnd();
log.info('------------------------------------------------------------------------');
log.info('');
var importTask = new ImportTask();

importTask.start(range);


/**
 *  部分批处理函数 
 */
function range(val) {
    return val.split('..').map(Number);
}
function list(val) {
    return val.split(',');
}