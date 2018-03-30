// process.argv.forEach(download);

// function download () {

// }
var program = require('commander');
  
program
  .version('0.1.0', '-v, --version')
  .option('-i, --id <value>', 'Task ID')
  .option('-d, --date <items>', 'Start Date , End Date [option]')
  .option('-t, --time <items>', 'Start Time , End Time [option]')
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

function range(val) {
    return val.split('..').map(Number);
}
function list(val) {
    return val.split(',');
}

console.log('you will start a downlaod job with:');
console.log('');
if (program.id) console.log('    Task', program.id);
if (program.date) console.log('    date', program.date);
if (program.time) console.log('    time', program.time);
if (program.range) console.log('    range', program.range);
console.log('');
console.log('当前尚未接入参数校验模块，如任务失败请自行检查参数！');