/*
 * @Author: qiansc 
 * @Date: 2018-06-27 20:46:01 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-28 23:32:42
 */
// class DimChained{
//     constructor(){
        
//     }
// }
module.exports = {
    produce: function(string){
        // input "idc=*,format=*"
        // return { idc: '*', format: '*' }
        let parten = {};
        string.split(',').forEach(item => {
            let r =  this.parseItem(item);
            if (r){
                parten[r.key] = r.value;
            }
        });
        return parten;
    },
    parseItem: function(string) {
        if (string === "all") {
            return false;
        }
        let arr = string.split('=');
        return {
            key: arr[0],
            value: decodeURIComponent(arr[1])
        };
    },
    produceItem: function (key, value) {
        if (value === "_all") {
            return "all";
        }
        return  key + '=' + encodeURIComponent(value);
    }
};
