/*
 * @Author: qiansc 
 * @Date: 2018-06-11 00:17:47 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-07-18 18:41:06
 */
const Log = require('../util/log');
const program = require('commander');
const path = require('path');
const log = new Log(2);
const EventEmitter = require('events');

const SuperTask = require('../task/task-super');
const Config = require('../core/config.js');
const History = require('../core/history.js');
const Range = require('../util/range');
const parseRange = require('../util/parse-range');

class Runner extends EventEmitter{
    constructor (cmd, dir) {
        super();
        this.cmd =  cmd;
        this.dir = dir;
    }

    exe () {

        let action, config, taskId, range;

        program
          .version('0.1.0', '-v, --version')
          .option('-s, --start <items>', 'Start Date / Datetime')
          .option('-e, --end <items>', 'End Date / Datetime')
          .option('-r, --range <value>', 'Ranges(d,h,m,s) [option]')
          .option('-i, --input <file>', 'Output File [option]', 'default')
          .option('-o, --output <file>', 'Input File [option]')
          .option('--ii <value>', 'Input Intervals Combinded [option]')
          .option('--oi <value>', 'Output Intervals Combinded [option]')
          .option('-k, --key <value>', 'Prev Action Key [option]')
          .option('-l, --log <value>', 'Log Output Level Since Less to All( 0 ~ 9 )')
          .option('-p, --project <value>', 'Specify Project');
        
        program.on('--help', function(){
            log.info('');
            log.info('  Examples:');
            log.info('');
            log.info('    $ dmr run acit -s 20180401.1200.00 -e 20180401120010');
            log.info('    $ dmr run acit -s 20180401.1200.00 -r 10s');
            log.info('    $ dmr run acit -s 20180401120000 -r 10s -o ./rs.log');
            log.info('    $ dmr run acit -s -5m -r 10s');
            log.info('    $ dmr run acit -s -5m -r 10s -l 0');
            log.info('    $ dmr run acit -s -5m -r 10s -p speedup-ace ');
            log.info('');
            log.info('  Supported Task:');
            log.info('');
            log.info('    acit      import and transfer search_ac.log');
            log.info(' ');
        });
        
        program.command('*').description('Task Id')
        .action(function(arg){
            taskId = arg;
        });
        program.parse(this.cmd);

        action = {
            input: program.input || false,
            output:  program.output || false,
            key: program.key || false,
            taskid: taskId,
            ii: program.ii || false,
            oi: program.oi || false
        };
        
        
        
        if (program.log !== undefined){
            Log.setGlobalLev(program.log);
        }
        
        /**
         *  命令提示
         */
        log.info('------------------------------------------------------------------------');
        // log.group('    ');
        log.info('You will start a task with following config:');
        log.info('\r\n');
        
        // Deal Task Id
        if (taskId){
            log.info('Task Name\t\t', taskId);
            let config = Config.find('task',taskId);
            if (config.description) {
                log.info('Task Description\t ' + config.description);
            }
        }else {
            log.info('Task ID is required!');
            return;
        }
        
        // Deal File
        if (action.output == "console") {
            log.info('Output ', 'Console');
        } else if (action.output == "default") {
            log.info('Output ', 'Use TaskConfig');
        } else if (action.output){
            action.output = path.resolve(this.dir, action.output);
        }
        if (action.input == "default") {
            log.info('Input ', 'Use TaskConfig');
        } else if (action.input){
            action.input = path.resolve(this.dir, action.input);
        }
        
        // Deal Project
        
        if (program.project) {
            log.info('Specify Project >>> ' + program.project);
        }
        
        // log.groupEnd();
        log.info('------------------------------------------------------------------------\r\n');
        
        // Deal Key && Range
        range = parseRange(program);
        if (range) {
            action.range = range.param();
        } else {
            log.info('Key or RangeInfo is required!');
            return;
        }
        
        if (action.key){
            let history = History.get(action.key);
            // 原输出
            let output = action.output;
            action = history.info.action;
            if (action.taskid !== taskId){
                // 如果任务不同，则视为任务延续
                config = Config.find('task',taskId);
                action.input = action.output;
                action.output = output;
                action.taskid = taskId;
                action.ii = program.ii || action.oi;
                action.oi =  program.oi || false;
            } else {
                // 如参数相同视为重跑，恢复原任务的config并重跑
                config = history.info.config;
            }
        } else {
            config = Config.find('task',taskId);
        }
        
        log.info('' + new Range(action.range).toString('\r\n'));
        
        
        let task = new SuperTask(config);
        
        const RandomKey = require('../util/random-key');
        let key = new RandomKey().get();
        
        task.on('end',() =>{
            History.add(key, task.id, {
                action: action,
                config: config
            });
            log.info('L5', 'You can [restart this job / start next job] by using Action Key : -k ' + key);
        });
        
        task.run(action);


    }
}
module.exports = Runner;