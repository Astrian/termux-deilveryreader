#! /bin/sh
pkg install git
pkg install nodejs
pkg install termux-api
termux-sms-list
apt install yarn
git clone https://github.com/Astrian/termux-deilveryreader
cd termux-deilveryreader
yarn
npm run initial
