#!/usr/bin/env bash

yarn clean
./node_modules/.bin/tsc
chmod +x dist/src/cli/*
