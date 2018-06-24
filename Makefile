# @author: qiansicheng(qiansicheng@baidu.com)
# Use npm scripts instead

# Variables

export PORT=9877
export KARMA_BIN=./node_modules/karma/bin/karma
export TEST=$(KARMA_BIN) --port $(PORT)
export DOC=./node_modules/.bin/jsdoc2md
export NAME=$(shell node -p 'require("./package.json").name')
export VERSION=$(shell node -p 'require("./package.json").version')
export DESCRIPTION=$(shell node -p 'require("./package.json").description')

.PHONY: test dist doc



# rm -rf ./docs
doc:
	rm -rf ./docs/api
	mkdir ./docs/api

#	$(DOC) src/prefetch.js > docs/api/prefetch.md

exp:
	npm run example

install:
	npm install forever -g
	npm install

start:
	forever start -o out.log -e err.log -a bin/test.js
#	apm install
stop:
	forever stop bin/test.js
update-apm:
#	apm install --save

apm-instal:
	npm instal apmjs -g

apm-login:
	npm login --registry=http://apmjs.baidu.com --scope=@baidu

apm-publish:
	npm publish