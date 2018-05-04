/*
 * @Author: qiansc 
 * @Date: 2018-04-27 16:58:06 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-04 19:05:02
 */

var http = require('http');
var url = require('url');
var querystring = require("querystring");

class Server {


    start () {
        http.createServer(function(request, response){

            try {
                handler(request, response);
              } catch(e) {
                console.log('\r\n', e, '\r\n', e.stack);
                try {
                    response.end('{"status":"505","msg":"数据暂缺失"}');
                } catch(e) { }
              }
            response.end();
        }).listen(8083);
        
    }
 }

 function handler(request, response){
    response.writeHead(200, { 'Content-Type': 'application/json' });
    var queryUrl =  url.parse(request.url);
    if (queryUrl.pathname == '/api/sc/chartData') {
        var qs = querystring.parse(queryUrl.query);
        var conditions = JSON.parse(qs.conditions);
        conditions = conditionsToParam(conditions);
        //console.log(conditions);
        try{
            var result = table(conditions);
        }catch(e){
            console.log(e);
        }
        response.write(table(conditions));
    }
 }

 module.exports = Server;

 var Config = require('../core/config.js');
 var Range = require('../util/range');
 var SourceFactory = require('../source/factory');
 var TimeFormatter = require('../formatter/formatter-time');

 function table (conditions){
    var config =  Config.get('report', "scraft-cus", "scraft-cus-hour");
    let inputSource = SourceFactory.create(config["input-source"]);
    var range = new Range();

    startDatetime = conditions.date + conditions.hour + '0000';
    startDatetime = TimeFormatter.fillDatetime(startDatetime.replace(/[\-\:\\\.]/g,''));
    startDatetime = TimeFormatter.parseDatetime(startDatetime, 'HHHHMMDDhhmmss');
    range.setStartDatetime(startDatetime);
    range.setInterval('1h');

    inputSource.setActionParam({range:range.param(),file:"default"});
    let lines = inputSource.readSync().split('\n');
    var rowsdata = [], rows= [];
    lines.forEach((line ,index)=> {
        if(index == 0) return;
        let arr = line.split('\t');
        if(arr.length != 3) return;
        let dims = arr[0].split('|');
        if(conditions.system == dims[0] || dims[0] == "sys=" + conditions.system){
            rowsdata[dims[1]] = rowsdata[dims[1]] || {};
            rowsdata[dims[1]][arr[1]] = arr[2];
        }
    });

    Object.keys(rowsdata).forEach(field => {
        rows.push({
            field: field,
            count: rowsdata[field].count,
            avg: rowsdata[field].avg,
            pos80: rowsdata[field].pos80
        });
    });

     var result = {};
     result.status = 0;
     result.msg = "";
     var data = {};
     result.data = data;
     data.columns = [{
        name: '指标',    // 显示的表头
        id: 'field',        // 该列绑定的数据字段名称
        unit: '',          // 单位，可以不传
        textAlign: 'left', // 列中文字的对其方式，left、right、center, 可不传
        autoWrap: true,    // 文字太多时是否自动换行
        // width: '200px',    // 列宽度，可不传，默认为自适应，可传：100px、25%之类
        accuracy: '2'      // 数据是小数时，保留的位数（四舍五入，不够位数会补零），可不传
    },{
        name: '样本量',    // 显示的表头
        id: 'count',        // 该列绑定的数据字段名称
        unit: '',          // 单位，可以不传
        textAlign: 'left', // 列中文字的对其方式，left、right、center, 可不传
        autoWrap: true,    // 文字太多时是否自动换行
        // width: '200px',    // 列宽度，可不传，默认为自适应，可传：100px、25%之类
        accuracy: '2'      // 数据是小数时，保留的位数（四舍五入，不够位数会补零），可不传
    },{
        name: '均值耗时',    // 显示的表头
        id: 'avg',        // 该列绑定的数据字段名称
        unit: 'ms',          // 单位，可以不传
        textAlign: 'left', // 列中文字的对其方式，left、right、center, 可不传
        autoWrap: true,    // 文字太多时是否自动换行
        // width: '200px',    // 列宽度，可不传，默认为自适应，可传：100px、25%之类
        accuracy: '2'      // 数据是小数时，保留的位数（四舍五入，不够位数会补零），可不传
    },{
        name: '80分位',    // 显示的表头
        id: 'pos80',        // 该列绑定的数据字段名称
        unit: 'ms',          // 单位，可以不传
        textAlign: 'left', // 列中文字的对其方式，left、right、center, 可不传
        autoWrap: true,    // 文字太多时是否自动换行
        // width: '200px',    // 列宽度，可不传，默认为自适应，可传：100px、25%之类
        accuracy: '2'      // 数据是小数时，保留的位数（四舍五入，不够位数会补零），可不传
    }];
     data.rows = rows;
    return JSON.stringify(result);
 }

//  data.columns = [{
//     name: '表头名1',    // 显示的表头
//     id: 'key1',        // 该列绑定的数据字段名称
//     unit: '',          // 单位，可以不传
//     textAlign: 'left', // 列中文字的对其方式，left、right、center, 可不传
//     autoWrap: true,    // 文字太多时是否自动换行
//     width: '200px',    // 列宽度，可不传，默认为自适应，可传：100px、25%之类
//     accuracy: '2'      // 数据是小数时，保留的位数（四舍五入，不够位数会补零），可不传
// }];
//  data.rows = [{
//     key1: 12313, // key和columns中的id一一对应
//     key2: '<button>本宝宝是个html</button>',
//     // key1_level: 'red', // 在字段名后加_level,表示展示时的字体颜色，可以是 red、green，当然可以不传,
//     // __showx_row_level: 'red', // 整行飘红或飘绿，优先级低于单个字段的飘红飘绿设定
//     // key2_ishtml: true, // 在字段名后加_ishtml,表示展示时以html内容进行解析，可以不传。
//     // key2_noPadding: true, // 在字段名后加_noPadding,表示展示时表格单元格内不加padding属性，使传入的dom占满单元格，可以不传。
//     // key2_background: '#ff6c00', // 在字段名后加_background,表示展示时表格单元格背景色，可以不传。
// },{
//     key1: 12313, // key和columns中的id一一对应
//     key2: 12312,
// }];

function conditionsToParam(conditions){
    conditions = conditions || [];
    var param = {};
    conditions.forEach(item => {
        param[item.k] = item.v;
    });
    return param;
}
