let request = require('request')
let debug = require('debug')('send:send.js')
let fs = require('fs')
let data = fs.readFileSync('deilveryData')
let botToken = require('config.js').telegram.bot_token
let tgId = require('config.js').telegram.user_id
debug(data.toString())
if (data.toString() === '') return
debug('new line')
let requestBody = {
  chat_id: tgId,
  text: `你收到了以下快递，请注意查收：\n${data.toString()}`
}
request.post({url: `https://api.telegram.org/bot${botToken}/sendMessage`, form: requestBody}, (err,httpResponse,body) => {
  debug(body)
  if (err) throw new Error(err);
})
fs.writeFile('deilveryData', '',  (err)=> {
  if (err) throw new Error(err);
})
