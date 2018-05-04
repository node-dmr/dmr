/*
 * @Author: qiansc 
 * @Date: 2018-04-27 16:58:06 
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-05-04 17:28:14
 */

var http = require('http');
var url = require('url');

 class Server {


    start () {
        http.createServer(function(request, response){
            response.writeHead(200, { 'Content-Type': 'application/json' });
            var queryUrl =  url.parse(request.url);
            console.log(queryUrl);
            // response.write(JSON.stringify(queryUrl));
            if (queryUrl.pathname == '/api/sc/chartData') {
                response.write(table());
            }
            response.end();
        }).listen(8080);
        
    }
 }


 module.exports = Server;

 function table (){
     var result = {};
     result.status = 0;
     result.msg = "";
     var data = {};
     result.data = data;
     data.columns = [{
        name: '表头名1',    // 显示的表头
        id: 'key1',        // 该列绑定的数据字段名称
        unit: '',          // 单位，可以不传
        textAlign: 'left', // 列中文字的对其方式，left、right、center, 可不传
        autoWrap: true,    // 文字太多时是否自动换行
        width: '200px',    // 列宽度，可不传，默认为自适应，可传：100px、25%之类
        accuracy: '2'      // 数据是小数时，保留的位数（四舍五入，不够位数会补零），可不传
    }];
     data.rows = [{
        key1: 12313, // key和columns中的id一一对应
        key2: '<button>本宝宝是个html</button>',
        key1_level: 'red', // 在字段名后加_level,表示展示时的字体颜色，可以是 red、green，当然可以不传,
        __showx_row_level: 'red', // 整行飘红或飘绿，优先级低于单个字段的飘红飘绿设定
        key2_ishtml: true, // 在字段名后加_ishtml,表示展示时以html内容进行解析，可以不传。
        key2_noPadding: true, // 在字段名后加_noPadding,表示展示时表格单元格内不加padding属性，使传入的dom占满单元格，可以不传。
        key2_background: '#ff6c00', // 在字段名后加_background,表示展示时表格单元格背景色，可以不传。
    },{
        key1: 12313, // key和columns中的id一一对应
        key2: 12312,
    }];
    return JSON.stringify(result);
 }