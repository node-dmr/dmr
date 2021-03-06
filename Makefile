# Use npm scripts instead

# Variables

# export PORT=9877
# export KARMA_BIN=./node_modules/karma/bin/karma
# export TEST=$(KARMA_BIN) --port $(PORT)
export DOC=./node_modules/.bin/jsdoc2md
# export NAME=$(shell node -p 'require("./package.json").name')
# export VERSION=$(shell node -p 'require("./package.json").version')
# export DESCRIPTION=$(shell node -p 'require("./package.json").description')

.PHONY: test dist doc



# rm -rf ./docs
doc:
	rm -rf ./docs/api && mkdir ./docs/api
	$(DOC) src/util/range.js > docs/api/util-range.md
	$(DOC) src/util/task.js > docs/api/util-task.md
	$(DOC) src/util/config.js > docs/api/util-config.md
	$(DOC) src/task-sequence.js > docs/api/tasks-sequence.md
	$(DOC) src/task-io.js > docs/api/task-io.md

exp:
	npm run example

install:
#	npm install forever -g
	npm install
