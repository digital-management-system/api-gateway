SHELL = /bin/bash
OS = $(shell uname -s | tr '[:upper:]' '[:lower:]')
CURRENT_DIRECTORY = $(shell pwd)

# Build variables
BUILD_DIR ?= dist
REACT_APP_COMMIT ?= $(shell git rev-parse HEAD 2>/dev/null)
REACT_APP_BUILD_DATE ?= $(shell date +%FT%T%z)

.PHONY: all
all: dep build generate-graphql-schema ## Get all dependecies, build and generate GraphQL schema

.PHONY: clean
clean: ## Clean the working area and the project
	@rm -rf $(BUILD_DIR)/

.PHONY: dep
dep: ## Install dependencies
	@npm install

.PHONY: build
build: ## Build
	@npm run build

.PHONY: test
test: ## Run unit tests
	@npm test

.PHONY: format
format: ## Run code formatter
	@npm run format

.PHONY: generate-graphql-schema
generate-graphql-schema: ## Generate GraphQL schema
	@npm run format

.PHONY: list
list: ## List all make targets
	@$(MAKE) -pRrn : -f $(MAKEFILE_LIST) 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | sort

.PHONY: help
.DEFAULT_GOAL := help
help: ## Get help output
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Variable outputting/exporting rules
var-%: ; @echo $($*)
varexport-%: ; @echo $*=$($*)
