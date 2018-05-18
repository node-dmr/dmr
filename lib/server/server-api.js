/*
 * @Author: qiansc 
 * @Date: 2018-04-27 16:58:06 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-18 13:00:07
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
    } else if (queryUrl.pathname == '/api/ac/chartData'){
        var qs = querystring.parse(queryUrl.query);
        var conditions = JSON.parse(qs.conditions);
        conditions = conditionsToParam(conditions);
        //console.log(conditions);
        try{
            var result = ac(conditions);
        }catch(e){
            console.log(e);
        }
        response.write(ac(conditions));
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


function ac(conditions){
    // conditions.date;
    let startDatetime = conditions.date + '000000';
    startDatetime = TimeFormatter.fillDatetime(startDatetime.replace(/[\-\:\\\.]/g,''));
    startDatetime = TimeFormatter.parseDatetime(startDatetime, 'HHHHMMDDhhmmss');
    startDatetime = new Date(new Date(startDatetime).getTime()-14 * 24*3600*1000);
    startDatetime = TimeFormatter.format('HHHHMMDD', startDatetime);
    var url = "http://spy.baidu.com/api/perf/trend?startDay="+startDatetime+"&endDay="+startDatetime+"&module_id=1&product_id=1&groupname=searchAc";
    var rs = {"status":0,"data":{"series":[{"data":[522130,502089,519509,542653,511077,584633,0],"name":"tm","text":"tm"},{"data":[0,0,0,0,0,0,0],"name":"AT_fdat","text":"AT_fdat"},{"data":[0,0,0,0,0,0,0],"name":"AT_sdat","text":"AT_sdat"},{"data":[0,0,0,0,0,0,0],"name":"AT_ldat","text":"AT_ldat"},{"data":[0,0,0,0,0,0,0],"name":"AT_rdat","text":"AT_rdat"},{"data":[0,0,0,0,0,0,0],"name":"GT_lbt","text":"GT_lbt"},{"data":[0,0,0,0,0,0,0],"name":"GT_spt","text":"GT_spt"},{"data":[0,0,0,0,0,0,0],"name":"GT_rpt","text":"GT_rpt"},{"data":[0,0,0,0,0,0,0],"name":"GT_cmzt","text":"GT_cmzt"},{"data":[1091,1078,1087,1083,894,1055,0],"name":"RT","text":"RT"},{"data":[467,464,464,462,494,477,0],"name":"PT","text":"PT"},{"data":[16338,15999,16635,16733,15923,15874,0],"name":"IT","text":"IT"},{"data":[79452,78757,77792,76680,79098,87899,0],"name":"AT","text":"AT"},{"data":[216647,220572,214727,228163,255251,267579,0],"name":"GT","text":"GT"},{"data":[17455,17134,17918,16569,18737,17862,0],"name":"KT","text":"KT"},{"data":[0,0,0,0,0,0,0],"name":"KV1T","text":"KV1T"},{"data":[0,0,0,0,0,0,0],"name":"UT1","text":"UT1"},{"data":[0,0,0,0,0,0,0],"name":"KV2T","text":"KV2T"},{"data":[1667,1627,1599,1593,1655,1685,0],"name":"FT","text":"FT"},{"data":[89886,85854,88388,88182,89101,89893,0],"name":"UT","text":"UT"},{"data":[48574,46661,46038,47783,43043,49961,0],"name":"MT","text":"MT"},{"data":[1412,1347,1351,1368,1391,1405,0],"name":"RTT","text":"RTT"},{"data":[13621,13745,13781,13661,14218,14112,0],"name":"PP","text":"PP"},{"data":[0,0,0,0,0,0,0],"name":"AT_rAT","text":"AT_rAT"},{"data":[0,0,0,0,0,0,0],"name":"GT_rGT","text":"GT_rGT"}],"dayPv":{"20180428":379579,"20180429":436260,"20180430":417945,"20180501":403975,"20180502":477487,"20180503":409629,"20180504":0}}};
    console.log(url);

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
       name: '80分位',    // 显示的表头
       id: 'pos80',        // 该列绑定的数据字段名称
       unit: 'ms',          // 单位，可以不传
       textAlign: 'left', // 列中文字的对其方式，left、right、center, 可不传
       autoWrap: true,    // 文字太多时是否自动换行
       // width: '200px',    // 列宽度，可不传，默认为自适应，可传：100px、25%之类
       accuracy: '2'      // 数据是小数时，保留的位数（四舍五入，不够位数会补零），可不传
   }];

   var arr = rs.data.series;
   var rows = [];
   arr.forEach(line => {
        var field = line.name
        rows.push({
            field: field,
            pos80: line.data[0]/1000
        });
    });


    data.rows = rows;
   return JSON.stringify(result);

}