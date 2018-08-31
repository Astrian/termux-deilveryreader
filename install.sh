#! /bin/sh
pkg install git
pkg install nodejs
apt install yarn
git clone https://github.com/Astrian/termux-deilveryreader
cd termux-deilveryreader
yarn
npm run initial
