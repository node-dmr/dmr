# ACE Frame
Analysis Calculation Evaluation Frame

## 简介
ACE Frame 是在实现Speedup及相关业务需求过程中总结出来的数据分析、量化、评价框架，特点是开放处理过程，满足更多业务角色快速参与数据分析。框架主要聚焦数据处理、数据分析、任务调度等过程的模块化封装。

ACE 主要处理“原数据”至“报表数据”产出过程，不负责数据存储及数据通路，不负责数据展现。但是框架会兼容绝大多数的数据接入方式（如Ftp、Hadoop、北斗），及数据报表格式（ShowX、Spy、Speedup等），无缝关联指标及各展现平台结果。


**目前该项目为调试维护状态，开发环境和生产环境未分离，CLI后续推出**


## 生产环境

数据下载

```bash
# 查看download支持的命令及完整DEMO
bin/download --help
#下载search_ac日志，时间范围20180901的1200~1300
bin/dowload -i search_ac -d 20180901 -t 1200,1300
#下载search_ac日志，时间范围20180901的1200~+60s，自定义存储路径./rs.log
bin/dowload -i search_ac -d 20180901 -t 1200 -r 60s -f ./rs.log
```



## 开发环境准备

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