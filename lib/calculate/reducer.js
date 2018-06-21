/*
 * @Author: qiansc 
 * @Date: 2018-04-26 09:52:42 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-21 23:56:59
 */
class Reducer {
    constructor (option) {
        this.list = [];
        this.NaNCount = 0;
    }
    add (val) {
        let value = parseFloat(val);
        if (!isNaN(value)) {
            this.list.push(value);
        } else {
            this.NaNCount ++;
        }
    }
    /**
     * 
     * @param {*} value
     */
    reduce () {
        this.list = this.list.sort(function(x, y){
            return x >  y? 1:-1;
        });
        // var drop = Math.floor(this.list.length * 2 / 100);
        // this.list = this.list.slice(drop, -1 * drop);
    }
    avg () {
        let result = 0;
        
        this.list.forEach(item => {
            result += item * 1;
        });
        if (this.list.length == 0){
            return "";
        }
        let r = Math.round(result * 100 / this.list.length)/100;
        return r;
    }
    pos (p) {
        p = p || 80;
        let cur = Math.round(this.list.length * p / 100);
        return this.list[cur];
    }
    count () {
        return this.list.length || this.NaNCount;
    }
}

module.exports = Reducer;