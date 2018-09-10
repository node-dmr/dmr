/*
 * @Author: qiansc
 * @Date: 2018-08-06 11:29:52
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-09-10 23:07:14
 */
let cmd = {
  run : require('./runner')
};
module.exports = function (argv, cwd) {
  let bin = cmd[argv[2]];
  argv.splice(2, 1);
  let instance = new bin(argv, cwd);
  return instance.exe().catch(err => {console.log(err);});
};
