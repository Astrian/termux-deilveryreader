#! /bin/sh
pkg install git
pkg install nodejs
git clone https://github.com/Astrian/termux-deilveryreader
cd termux-deilveryreader
npm install
npm run initial
