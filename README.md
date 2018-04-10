# What`s ACE
ACE is a framework of processing log data  , including , but not limited to , Analysis , Calculate and Evaluate.

## 简介
ACE Frame 是在实现Speedup及相关业务需求过程中总结出来的数据分析、量化、评价框架，特点是开放处理过程，满足更多业务角色快速参与数据分析。框架主要聚焦数据处理、数据分析、任务调度等过程的模块化封装。

ACE 主要处理“原数据”至“报表数据”产出过程，不负责数据存储及数据通路，不负责数据展现。但是框架会兼容绝大多数的数据接入方式（如Ftp、Hadoop、北斗），及数据报表格式（ShowX、Spy、Speedup等），无缝关联指标及各展现平台结果。




## Start Your ACE Project Instance

### Project配置
**目前该项目为调试维护状态，生成Project Config的 CLI后续推出**

您可以从 http://gitlab.baidu.com/speedup/speedup-ace 获取已运用ace的speedup project，并通过修改框架\config\main.conf的speedup-ace 的root指向您的speedup project的目录。
```bash
    # 支持多个Project，缺省载入base-project
    # 如果您在执行任何bin时不希望使用使用缺省base-project的配置，可以附加-p project-name 指定已配置的project
    {
        "base-project": "speedup-ace",
        "speedup-ace": {
            "root" : "d:\\work\\speedup\\speedup-ace"
        }
    }
```

### 使用Bin

下面以download数据为例，了解bin的常规使用方法

```bash
# 查看import支持的命令及完整DEMO
bin/import --help

# 下载search_ac日志，时间范围从-s 到 -e的时间，时间支持非空格的字符切分，支持精确到天/分钟/秒三种选择
bin/import -i search_ac -s 20180401.1200.00 -e 20180401120010
# 不指定结束时间，采用-r参数指定一段时间，支持单位d/m/s/ms(day/minute/seconde/ms)
bin/import -i search_ac -s 20180401.1200.00 -r 10s
# -s/e 时间参数支持倒推一段时间，请采用-开头，支持d/m/s/ms(day/minute/seconde/ms)
bin/import -i search_ac -s -5m -r 10s

#-f 自定义基于当前命令行的存储路径./rs.log 或 使用project配置生成 -f default 不指定-f会直接打印
bin/import -i search_ac -s 20180401120000 -r 10s -f ./rs.log
# 默认会打印L5级别的日志，如果不希望打印任何日志可以设置0级别，如果希望打印所有细节调试可以设置9级别
bin/import -i search_ac -s -5m -r 10s -l 0
# 同上章节介绍，通过使用-p命令临时切换指定project的配置，而非使用缺省配置
bin/import -i search_ac -s -5m -r 10s -p speedup-ace 

```

更多的bin命令，请移步docs/bin了解（建设中）





## Develop ACE Frame

**您可以通过以下安装步骤，开始框架的开发与调试**

安装Node.js(版本>=4), Make, fis3:

```bash
brew install make
npm install -g fis3
```

依赖管理：

```bash
# 安装npm、apm所有依赖
make install

#只更新npm依赖
make update-apm
```

apm发布管理：

```bash
# 发布更新apm组件，需要手动更新版本号进行确认
make apm-publish

# apm环境安装
make apm-instal

# apm注册登录
make apm-login
```


更新API文档：

```bash
# 根据jsdoc更新doc/api
make doc
```

## 架构