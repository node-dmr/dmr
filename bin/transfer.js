/*
 * @Author: qiansc 
 * @Date: 2018-04-10 11:20:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-17 19:24:48
 */
var path = require('path');
var program = require('commander');
var Log = require('../packages/util/log');
var Range = require('../packages/util/range');
var TimeFormatter = require('../packages/formatter/time-formatter');
var TaskFactory = require('../packages/core/task-factory');
var Action = require('../packages/core/Action');

var log = new Log(2);

program
.version('0.1.0', '-v, --version')
.option('-t, --task <value>', 'Task ID')
.option('-k, --key <value>', 'Prev Action Key [option]')
.option('-r, --range <value>', 'Input File With Range [option]')
.option('-l, --log <value>', 'Log Output Level Since Less to All( 0 ~ 9 )')
.option('-p, --project <value>', 'Specify Project');

program.on('--help', function(){
  log.info('');
  log.info('  Examples:');
  log.info('');
  log.info('    $ transfer -t search_ac -k Y2BLE');
  log.info('    $ transfer -t search_ac -r 20180410-111743-60');
  log.info('    $ transfer -t search_ac -r 20180410-111743-60 -p speedup-ace ');
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
var key = program.key || false;
var range = program.range || false;
var action = new Action();
/**
 *  参数选项验证
 */
if (!taskId){
    log.info('Task ID is required!');
    return;
} else {
    var taskConfig = TaskFactory.getConfig('transfer', taskId);
}

log.info('------------------------------------------------------------------------');
// log.group('    ');
log.info('You will start a downlaod job with:');
log.info('');

if (file){
    // 从当前命令执行路径计算目标路径，会覆盖task默认file
    file = path.resolve(process.cwd(), file);
    action.set('file', file);
    log.info('[file] ', file);
} else if (range) {
    action.set('range', range);
    log.info('[range] ', range);
} else {
    log.info('File or  Range is required!');
    return;
}

action.set('task-type', "transfer");
action.set('task-id', taskId);

var task = TaskFactory.create(action);
task.run();