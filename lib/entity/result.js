/*
 * @Author: qiansc 
 * @Date: 2018-05-27 15:46:11 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-30 15:00:41
 */
class Result extends Array {
    get (key) {
        for(var i = 0; i < this.length; i++) {
            if (this[i] && this[i][0] === key) {
                return this[i][1];
            }
        }
    }
    set (key, value) {
        let writed = false;
        for(var i = 0; i < this.length; i++) {
            if (this[i] && this[i][0] === key) {
                this[i][1] = value;
                return value;
            }
        }
        this.push([key, value]);
    }
    remove (key) {
        for(var i = 0; i < this.length; i++) {
            if (this[i] && this[i][0] === key) {
                this.splice(i, 1);
            }
        }
    }
    add (arr) {
        this.set(arr[0], arr[1]);
    }
    keys () {
        var keys = [];
        this.forEach(arr => {
            if (arr) {
                keys.push(arr[0]);
            }
        });
        return keys;
    }
    // Predelete
    predel (key) {
        this.predelete = this.predelete || {};
        this.predelete[key] = true;
    }
    canceldel (key) {
        this.predelete = this.predelete || {};
        delete this.predelete[key];
    }
    del (key) {
        if (key) {
            this.predel(key);
        }
        this.predelete = this.predelete || {};
        let cur = 0;
        while(this.length > cur) {
            var key = this[cur][0];
            if (this.predelete[key]) {
                this.splice(cur, 1);
            } else {
                cur ++;
            }
        }
        delete this.predelete;
    } 
}

module.exports = Result;