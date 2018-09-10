[![Build Status](https://travis-ci.org/node-dmr/dmr.svg?branch=master)](https://travis-ci.org/node-dmr/dmr)
[![Coveralls](https://img.shields.io/coveralls/node-dmr/dmr.svg)](https://coveralls.io/github/node-dmr/dmr)
[![npm package](https://img.shields.io/npm/v/dmr.svg)](https://www.npmjs.org/package/dmr)
[![npm downloads](http://img.shields.io/npm/dm/dmr.svg)](https://www.npmjs.org/package/dmr)

# What`s DMR
DMR is a framework of processing log data.

**Please read the following information before you install dmr**

Alpha(0.5.x) version will be released  on NPM before **August 10th**.

It`s not ready for public before Alpha version.

Config-Ui-Cli and Docs / Language support / Unit Test is comming

Thank you for your attention!

## 简介
DMR 是一个开放过程的数据处理框架，除了提高业务数据报表产出的效率外，更注重让更多业务角色快速、独立参与数据分析。dmr主要完成数据处理过程中的工作（入库、转储、Map、Reduce、数据分析、数据评价、报表整合、任务调度、日程管理等）。

DMR 主要处理“原数据”至“报表数据”产出过程，不负责数据存储及数据通路，不负责数据展现。但是框架会提供主流兼容数据接入方式（如Ftp、Hadoop、Http等），并且在未来版本（^0.8.0）会提供一些主流平台的数据api支持（如spy、showx、echarts）。

DMR 工作需要大量的配置来运作，这些配置通常会在一个配置工程中维护，目前基于配置而非插件实现的原因是希望非前端的角色能够参与维护。DMR Alpha版本正式发布后，会提供DMR-UI提供可视化的界面，便捷地支持配置修改，甚至即时的数据分析及预览，预期9月左右完成，届时可以完整体验使用DMR框架的乐趣。

# 快速上手

在本章节我们的目标安装框架，使用框架的bin来完成初始化，并根据demo配置完成一个数据分析过程，包括入库（import）/转储（transfer）/计算处理（caculate）等。

## 安装框架

如果你的环境尚无node及npm，请先安装node (ver > 6.0)。
通过npm全局安装dmr框架模块：

```bash
    # 通过npm全局安装dmr框架
    npm install dmr -g
```

## 初始化

选择一个目录作为你的第一个项目目录，并通过init完成初始化创建

```bash
    # 通过npm全局安装dmr框架
    dmr init ./

    # 设置当前目录为默认项目，并在全局命令生效
    dmr init --base

    # 或者你可组合以上命令使用
    dmr init ./ --base
```
注意，如果你移动项目目录需要重新init --force更新注册信息

如果你使用dmr子命令时，遇到spawn EACCES错误，请设置全局安装dmr模块的bin目录的权限为可执行（777）
```
    dmr run --help

    # internal/child_process.js:325
    #    throw errnoException(err, 'spawn');
    #   ^
    #
    #Error: spawn EACCES
    #    at exports._errnoException (util.js:1022:11)
    #    at ChildProcess.spawn (internal/child_process.js:313:11)
    #    at exports.spawn (child_process.js:385:9)
    #    at Command.executeSubCommand
    #       ……
    #    at Object.<anonymous> (/home/cubede/.jumbo/lib/node_modules/dmr/bin/dmr:35:9)

    chmod -R 777 /home/cubede/.jumbo/lib/node_modules/dmr/bin/dmr

```

## 使用Bin

下面以import数据为例，了解bin的常规使用方法

```bash
# 查看import支持的命令及完整DEMO
dmr run --help

# -t aci是指定启动aci任务（一个下载search_ac日志的任务配置）
# 时间范围从-s 到 -e的时间，时间支持非空格的字符切分，支持精确到天/分钟/秒三种选择
dmr run aci -s 20180401.1200.00 -e 20180401120010

```

关于时间还有其他简便高效的使用方式：

```bash
# 不指定结束时间，采用-r参数指定一段时间，支持单位d/m/s/ms(day/minute/seconde/ms)
dmr run aci -s 20180401.1200.00 -r 10s
# -s/e 时间参数支持倒推一段时间，请采用-开头，支持d/m/s/ms(day/minute/seconde/ms)
dmr run aci -s -5m -r 10s
```

刚才的命令执行后，数据被打印到控制台，如果希望存入文件可以使用-f 命令指定文件

```bash
#-f 自定义基于当前命令行的存储路径./rs.log 或 使用project配置生成 -f default 不指定-f会直接打印
dmr run aci -s 20180401120000 -r 10s -f ./rs.log
```

使用-l参数可以指定不同日志等级调节控制台的信息呈现

使用-p参数可以指定其他的项目配置（默认是base-project）

```bash
# 默认会打印L5级别的日志，如果不希望打印任何日志可以设置0级别，如果希望打印所有细节调试可以设置9级别
dmr run aci -s -5m -r 10s -l 0
# 同上章节介绍，通过使用-p命令临时切换指定project的配置，而非使用缺省配置
dmr run aci -s -5m -r 10s -p speedup-ace

```

在完成import后会得到一个key，后续进行转储（transfer）数据时可以采用-k key复用import时候指定的一些参数，提高生产效率。


``` bash
# 转储的task id是act，配合key继续转储如下：
dmr run act -k L2BZP
```

act的产物按照目前的配置是个格式化文档，可以通过xls直接打开，第一行是字段表头，第二行开始是数据。

``` bash
dmr run acc -k L2BZP
```

# 最佳实践

在本章节我们会详细讲解源（Source）、管道（Pipeline）如何配置以实现任务，如何配置日程（Schedule）以实现任务例行。

**待补充**

## Source

## Pipeline

## Middleware

## Schedule

## 守护进程

# 开发者文档
以下章节内容待调整

**您可以通过以下安装步骤，开始框架的开发与调试**

## 架构

### How Pipeline & Middleware Work
Pipeline（管道）与Middleware（中间件）是框架实现数据流操作的重要结构，这套模式的优点：

- **高可配置化**：业务逻辑完全剥离框架，以纯conf配置形式驱动管道组合、数据分析、I/O存取
- **高可伸缩性**：通过对管道顺序调整，可以拆除或降低I/O管道的优先级，动态调整性能；也可以通过加入缓存管道协调单进程间的reduce阻塞
- **易扩展** 已经有简易版本的mapper&reducer pipeline，这意味着打包两个阶段的pipeline及配置就可以快速实现hadoop集群计算，满足更大吞吐的数据分析；同时通过设计pipeline保证产出数据的一致性使得未来可能实现小规模机器间的数据资源交换



上述配置较为复杂，但并不推荐业务日志如此复杂（也验证了以上模式带来的高度可配置化）。规范日志会简化数据配置、提升运行时效率，后续也会通过推出打点日志CLI工具来协助产生标准的日志打点js及pipeline配置。

### Config

### Task

### Cron

### Plan
