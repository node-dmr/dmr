/*
 * @Author: qiansc 
 * @Date: 2018-04-10 11:20:25 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-10 15:27:23
 */

var Log = require('../packages/util/log');
var log = new Log(2);

var program = require('commander');
var path = require('path');
var Range = require('../packages/util/range');
var Time = require('../packages/util/time');
var StoreTask = require('../packages/task/store-task');

program
.version('0.1.0', '-v, --version')
.option('-i, --id <value>', 'Task ID')
// .option('-s, --start <items>', 'Start Date / Datetime')
// .option('-e, --end <items>', 'End Date / Datetime')
// .option('-r, --range <value>', 'Ranges(d,h,m,s) [option]')
.option('-f, --file <file>', 'Input File [option]')
.option('-o, --origin <value>', 'Input File With Config[option]')
.option('-l, --log <value>', 'Log Output Level Since Less to All( 0 ~ 9 )')
.option('-p, --project <value>', 'Specify Project');

program.on('--help', function(){
  log.info('');
  log.info('  Examples:');
  log.info('');
  log.info('    $ store -i search_ac -f ~\\speedup-ace\\data\\import\\search-ac\\20180410\\111743-60');
  log.info('    $ store -i search_ac -o 20180410\\111743-60');
  log.info('    $ import -i search_ac -o 20180410\\111743-60 -p speedup-ace ');
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
var file = program.file || false;
var task;
/**
 *  参数选项验证
 */
if (!taskId){
    log.info('Task ID is required!');
    return;
} else {
    task = new StoreTask(taskId);
}

StoreTask.test();

if (file){
    // 从当前命令执行路径计算目标路径，会覆盖task默认file
    file = path.resolve(process.cwd(), file);
    console.log(path);
    // importTask.setFilePath(file);
    //log.info('filePath ', importTask.getFilePath());
}