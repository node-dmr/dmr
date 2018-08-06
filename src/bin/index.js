/*
 * @Author: qiansc
 * @Date: 2018-08-06 11:29:52
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-08-06 13:15:01
 */
let cmd = {
  run : require('./runner')
};
module.exports = function (argv, cwd) {
  let bin = cmd[argv[2]];
  argv.splice(2, 1);
  let instance = new bin(argv, cwd);
  instance.exe();
};
