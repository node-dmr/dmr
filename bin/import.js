/*
 * @Author: qiansc 
 * @Date: 2018-04-02 11:18:49 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 20:48:19
 */

var Log = require('../packages/util/log');
var log = new Log(2);

var program = require('commander');
var path = require('path');
var TaskFactory = require('../packages/core/task-factory');
var Action = require('../packages/core/Action');
var parseRange = require('./util/parse-range');

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
var file = program.file || false;
var action = new Action();
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
log.info('You will start a downlaod job with:\r\n');
if (taskId){
    log.info('Task', taskId);
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