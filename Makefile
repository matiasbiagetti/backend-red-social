# Define variables
SHELL := /bin/bash
PROJECT_NAME := backend-red-social
ENV_FILE := .env

# Default target
.DEFAULT_GOAL := help

# Command to install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Command to run the project locally
run-local: install
	@echo "Running project locally..."
	npm run dev

# Command to run the linter
lint:
	@echo "Running linter..."
	npx eslint .

# Command to fix linter errors
lint-fix:
	@echo "Running linter and fixing issues..."
	npx eslint . --fix

# Command to check for outdated dependencies
check-updates:
	@echo "Checking for outdated dependencies..."
	npx npm-check-updates


# Command to build the project
build:
	@echo "Building the project..."
	npm run build

# Command to start the project in production mode
start:
	@echo "Starting the project in production mode..."
	npm start


# Help command to display available commands
help:
	@echo "Usage:"
	@echo "  make <target>"
	@echo
	@echo "Targets:"
	@echo "  install        Install project dependencies"
	@echo "  run-local      Run the project locally"
	@echo "  lint           Run the linter"
	@echo "  lint-fix       Run the linter and fix issues"
	@echo "  build          Build the project"
	@echo "  start          Start the project in production mode"

