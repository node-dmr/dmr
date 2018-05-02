/*
 * @Author: qiansc 
 * @Date: 2018-04-02 11:18:49 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-02 20:47:13
 */

var Log = require('../packages/util/log');
var log = new Log(2);

var program = require('commander');
var path = require('path');
var SuperTask = require('../packages/task/task-super');
var Config = require('../packages/core/config.js');
var Action = require('../packages/core/action');
var parseAction = require('./util/parse-action');
var parseRange = require('./util/parse-range');

program
  .version('0.1.0', '-v, --version')
  .option('-t, --task <value>', 'Task ID')
  .option('-s, --start <items>', 'Start Date / Datetime')
  .option('-e, --end <items>', 'End Date / Datetime')
  .option('-r, --range <value>', 'Ranges(d,h,m,s) [option]')
  .option('-f, --file <file>', 'Output File [option]')
  .option('-k, --key <value>', 'Prev Action Key [option]')
  .option('-l, --log <value>', 'Log Output Level Since Less to All( 0 ~ 9 )')
  .option('-p, --project <value>', 'Specify Project');

program.on('--help', function(){
    log.info('');
    log.info('  Examples:');
    log.info('');
    log.info('    $ start -t acit -s 20180401.1200.00 -e 20180401120010');
    log.info('    $ start -t acit -s 20180401.1200.00 -r 10s');
    log.info('    $ start -t acit -s 20180401120000 -r 10s -f ./rs.log');
    log.info('    $ start -t acit -s -5m -r 10s');
    log.info('    $ start -t acit -s -5m -r 10s -l 0');
    log.info('    $ start -t acit -s -5m -r 10s -p speedup-ace ');
    log.info('');
    log.info('  Supported Task:');
    log.info('');
    log.info('    acit      import and transfer search_ac.log');
    log.info(' ');
});

program.parse(process.argv);

if (program.log !== undefined){
    Log.setGlobalLev(program.log);
}

var taskId = program.task || false;
var file = program.file || false;
var action = new Action();
var key = program.key || false;
/**
 *  参数选项验证
 */
if (!taskId){
    log.info('Task ID is required!');
    return;
}

var range = parseRange(program);
/**
 *  校验成功后的命令提示
 */
log.info('------------------------------------------------------------------------');
// log.group('    ');
log.info('You will start a task with following config:');
log.info('\r\n');
if (taskId){
    log.info('Task Name\t\t', taskId);
    var config = Config.find('task',taskId);
    if (config.description) {
        log.info('Task Description\t ' + config.description);
    }
}else {
    log.info('Task ID is required!');
}
log.info('' + range.toString('\r\n'));

if (file == "default") {
    action.set("file", "default");
    log.info('FilePath ', 'Use TaskConfig');
} else if (file){
    // 从当前命令执行路径计算目标路径，会覆盖task默认file
    file = path.resolve(process.cwd(), file);
    action.set('file', file);
}

if (program.project) {
    log.info('Specify Project >>> ' + program.project);
}

// log.groupEnd();
log.info('------------------------------------------------------------------------\r\n');

if (key){
    // 从当前命令执行路径计算目标路径，会覆盖task默认file
    // file = path.resolve(process.cwd(), file);
    // action.set('file', file);
    // log.info('[file] ', file);
    action = parseAction(key);
    action.set('config', Config.find('task',taskId));
} else if (range) {
    action.set('range', range.param());
    action.set('config', Config.find('task',taskId));
} else {
    log.info('Key or RangeInfo is required!');
    return;
}


var task = new SuperTask(action);

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