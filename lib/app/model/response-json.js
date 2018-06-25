/*
 * @Author: qiansc 
 * @Date: 2018-06-25 21:06:24 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-06-25 21:49:29
 */
class Response {
    constructor() {
        this.json = {
            status: 0,
            msg: ''
        };
    }
    set(k, v) {
        this.json[k] = v;
    }
    get() {
        return this.json;
    }
    err(msg, status) {
        this.json.msg = msg;
        this.json.status = status || -1;
    }
}
module.exports =  Response;