/*
 * @Author: qiansc 
 * @Date: 2018-05-06 20:36:51 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-06 23:57:27
 */
const readline = require('readline');

function confirm (string){
    string = string || 'Thank you for your Choice: ';
    let result, callback;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
    rl.question('(Yes/No)',
        (answer) => {
            if (answer.toLowerCase().indexOf('n') == 0){
                result = false;
            } else if (answer.toLowerCase().indexOf('y') == 0){
                result = true;
            }
            rl.close();
            if (result === undefined) {
                result = confirm(string).next(callback);
            } else {
                console.log(string + (result ? 'Yes' : 'No'));
                callback(result);
            }
    });
    return {
        next: function(cb){
            callback = cb;
        }
    }
}
function input(string){
    string = string || 'Please Input :';
    let result, callback;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
      
    rl.question(string,
        (answer) => {
            rl.close();
            if(callback(answer) === false){
                console.log(111);
                input(string).next(callback);
            };
    });

    return {
        next: function(cb){
            callback = cb;
        }
    }
}
 module.exports = {
     confirm: confirm,
     input: input
 }