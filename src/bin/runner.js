/*
 * @Author: qiansc
 * @Date: 2018-06-11 00:17:47
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-10 10:36:13
 */
// const Log = require('../util/log');
const Moment = require('moment');
const Duration = Moment.duration;
const pkg = require('../../package.json');
const program = require('commander');
const path = require('path');
const EventEmitter = require('events');
const log = require('./log');
const Config = require('../util/config');
const Range = require('../util/range');
const Tasks = require('../tasks');
const fs = require('fs');
// const log = new Log(2);


// const SuperTask = require('../task/task-super');
// const Config = require('../core/config.js');
// const History = require('../core/history.js');
// const Range = require('../util/range');
// const parseRange = require('../util/parse-range');

class Runner extends EventEmitter{
    constructor (argv, cwd) {
        super();
        this.argv =  argv;
        this.cwd = cwd;
    }

    exe () {

        let action, config, taskId;
        program
          .usage('run task [options]')
          .version(pkg.version, '-v, --version')
          .option('-s, --start <items>', 'Start Moment')
          .option('-d, --duration <value>', 'Durations [option]')
          .option('-e, --end <items>', 'End Moment [option]')
          .option('-i, --input <file>', 'Input File [option]', 'default')
          .option('-o, --output <file>', 'Output File [option]')
          .option('--ii <value>', 'Input Intervals Combinded [option]')
          .option('--oi <value>', 'Output Intervals Combinded [option]')
          .option('-l, --log <value>', 'Log Output Level Since Less to All( 0 ~ 9 )');

        program.on('--help', function(){
            log.tab();
              log.tab();
                log.info('Examples:');
                log.tab();
                  log.info('$ dmr run hello/import -s 2018-08-08T12 -d P60m -o console');
                  log.info('$ dmr run hello/import -s 2018-08-08T12:00:00 -e 20180808T13 -o default');
                  log.info('$ dmr run hello/import -s 20180808T120000.000 -d 01:00:00 -o default');
                  log.info('$ dmr run hello/import -s 20180808T12 -e 20180808T12++01:00:00 -o ./rs.log');
                  log.info('$ dmr run hello/import -s now--P3D -d P3D -ii P1h -oi P1D -o console');
                  log.info('');
                log.tabEnd();
                // log.info('Supported Task:');
                // log.tab();
                //   log.info('');
                //   log.info('acit  import and transfer search_ac.log');
                // log.tabEnd();
              log.tabEnd();
        });

        program.command('*').description('Task Id')
        .action(function(arg,arg0){
            taskId = arg;
        });
        program.parse(this.argv);

        if (!taskId || typeof taskId !== "string") {
          log.info('Task ID is required!');
          return Promise.reject();
        }


        let scope = {
          cwd: this.cwd,
        };

        // dmr run ./config/hello/import
        let confPath = path.resolve(this.cwd, taskId);
        if (!fs.existsSync(confPath)) {
          // dmr run hello/import
          confPath = path.resolve(this.cwd, './config/' + taskId);
        }
        if (!fs.existsSync(confPath)) {
          log.warn('[Error] Task config %s does not exist!', taskId);
          return Promise.reject();
        }
        config = new Config(confPath);

        // let task = new SuperTask(config);
        let range = new Range(program.start , program.duration, program.end);
        if (!range.isValid()) {
          log.warn(range.toString(), ', please check following:');
          log.warn('-s start\t%s\n-d duration\t%s\n-e end\t\t%s', program.start , program.duration, program.end);
          return Promise.reject();
        }

        if (program.ii) {
          tasks.setInputInterval(Duration(program.ii));
        }

        if (program.oi) {
          tasks.setOutputInterval(Duration(program.oi));
        }

        if (program.input) {

        }

        return Promise.resolve();

        /**
         * taskid
         * dmr run project/aci
         * dmr run ./config/project/aci.task
         */

        action = {
            input: program.input || false,
            output:  program.output || false,
            ii: program.ii || false,
            oi: program.oi || false
        };



        // if (program.log !== undefined){
        //     Log.setGlobalLev(program.log);
        // }

        /**
         *  命令提示
         */
        log.line();
        // log.group('    ');
        log.info('You will start a task with following config:');
        log.info('');
        // Deal Task Id
        if (config.description) {
          log.info('Task Description\t ' + config.description);
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



        return;

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


        log.info('' + new Range(action.range).toString('\r\n'));




        // const RandomKey = require('../util/random-key');
        // let key = new RandomKey().get();

        // task.on('end',() =>{
        //     History.add(key, task.id, {
        //         action: action,
        //         config: config
        //     });
        //     log.info('L5', 'You can [restart this job / start next job] by using Action Key : -k ' + key);
        // });

        task.run(action);


    }
}
module.exports = Runner;
