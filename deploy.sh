#!/bin/bash
cd ~/tino-frontend
git pull origin main
yarn install &&
yarn build &&
pm2 restart tino 