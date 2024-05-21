#!/bin/bash

rm -rf dist
tsc
cp -r {package.json,package-lock.json,vercel.json} dist/
cd dist
vercel dev
# and follow the instructions to setup a new project
# once project is created setup environment variables