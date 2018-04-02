/*
 * @Author: qiansc 
 * @Date: 2018-04-02 11:18:49 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-02 18:50:43
 */

var program = require('commander');
var Range = require('../lib/util/range');
var Time = require('../lib/util/time');
var DowloadTask = require('../lib/task/dowload-task');

program
  .version('0.1.0', '-v, --version')
  .option('-i, --id <value>', 'Task ID')
  .option('-s, --start <items>', 'Start Date / Datetime')
  .option('-e, --end <items>', 'End Date / Datetime')
  .option('-r, --range <value>', 'Ranges(d,h,m,s) [option]')
  .option('-f, --file <file>', 'Output File [option]');

program.on('--help', function(){
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ dowload -i search_ac -d 20180901 -r 1d ');
    console.log('    $ dowload -i search_ac -d 20180901,20180902');
    console.log('    $ dowload -i search_ac -d 20180901 -t 1200,1300');
    console.log('    $ dowload -i search_ac -d 20180901 -t 1200 -r 60s -f ./test.log');
    console.log('');
    console.log('  Supported Task:');
    console.log('');
    console.log('    search_ac      search_ac.log');
    console.log(' ');
});

program.parse(process.argv);

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
    console.log('Task ID is required!');
    return;
}

if (startDatetime) {
    startDatetime = Time.fillDatetime(startDatetime.replace(/[\-\:\\]/g,''));
    startDatetime = Time.parseDatetime(startDatetime, 'HHHHMMDDhhmmss');
    range.setStartDatetime(startDatetime);
} else {
    console.log('Start Date / Datetime is required!');
    return;
}
if((endDatetime && rangeString) || (!endDatetime && !rangeString)) {
    console.log('You Should choose Option between  End Datetime / Ranges!');
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
console.log('You will start a downlaod job with:');
console.log('');
if (taskId) console.log('    Task', taskId);
console.log('    ' + range.toString('\r\n    '));
if (file) console.log('    file', file);





/**
 *  部分批处理函数 
 */
function range(val) {
    return val.split('..').map(Number);
}
function list(val) {
    return val.split(',');
}