#!/bin/bash

cp -r dist/.vercel .vercel
rm -rf dist
tsc
cp -r {.vercel,package.json,package-lock.json,vercel.json} dist/
cd dist
vercel deploy --prod
cd ..
rm -rf .vercel