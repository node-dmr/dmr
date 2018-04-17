/*
 * @Author: qiansc 
 * @Date: 2018-04-17 18:58:22 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-04-18 00:17:26
 */


function RandomKey(){
    var me = this;
    me.source = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    me.letter = "EFGHIJKLMNOPQRSTUVWXYZ";
    me.number = "123456789";
    me.mark = "SPEEDUPACEISTHEBEST";

    me.get = function(){
        var lettval = me.generatePassword(1, me.letter);
        var range = me.generatePassword(2, me.source);
        var numval = me.generatePassword(1, me.number);
        var markval = me.generatePassword(1, me.mark);
        var pwd = lettval + numval + range + markval;
        return pwd;
    };

    me.generatePassword = function(length,resource){
        length = length || 32;   
        var s = "";  
        for(var i = 0;i < length; i++)  {  
            s += resource.charAt(
                Math.ceil(Math.random()*1000)%resource.length
            );  
        }
        return s;  
    };
}
module.exports = RandomKey;