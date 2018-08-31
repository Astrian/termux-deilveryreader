const readline = require('readline')
const Process = require('child_process')
const sync = require('sync_back')({ debug: true })
const fs = require('fs')
const request = require('request')

sync(function* (api) {
  let input = yield readSyncByRl('是否执行 Telegram 配置程序？\n输入 y 确认，输入其他字符串跳过：').then((res) => { api.next(null, res) })
  if (input === 'y') yield setTelegram(api.next)
  console.log(' ')
  input = yield readSyncByRl('是否帮你部署 Tasker 脚本？\n输入 y 确认，输入其他字符串跳过：').then((res) => { api.next(null, res) })
  if (input === 'y') yield setScript(api.next)
  console.log(' ')
})

function readSyncByRl(tips) {
  tips = tips || '> ';

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(tips, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function setTelegram(callback) {sync(function* (api) {
  console.log('检查 config.js 文件是否存在...')
  let file
  let exist = fs.existsSync('config.js')
  if (exist) {
    console.log('注意！检测到 config.js 已存在。继续操作将覆盖该文件。')
    if ((yield readSyncByRl('点按回车确认，或输入 exit 并确认退出初始化程序。').then((res) => { api.next(null, res) })) === 'exit') return
  }
  console.log('现在，我需要你新建一个 Telegram 机器人。')
  console.log('你可以在 Telegram 中联系 BotFather（t.me/BotFather）')
  console.log('并向他发送 /newbot 文字')
  console.log('根据指引，你可以成功新建一个 bot，然后获得一个 bot token')
  console.log('token 看上去应该类似这样：')
  console.log('123456789:ABCDEFGhijklmnOPQRSTuvwxyz012345678')
  console.log('将它复制下来，顺便，别忘了把你的新 bot /start 一下')
  if ((yield readSyncByRl('点击回车继续。').then((res) => { api.next(null, res) })) === 'exit') return
  let token = yield readSyncByRl('粘贴获得的 token 并回车：').then((res) => { api.next(null, res) })
  if (token === '') {
    console.log('你没有输入任何信息。')
    console.log(' ')
    return
  }
  console.log(' ')
  console.log('很好。接下来我需要知道你的 Telegram 数字 ID')
  console.log('在 Telegram 中联系 t.me/get_id_bot')
  console.log('将它启动就可以获得你的数字 ID')
  if ((yield readSyncByRl('完成后，点击回车继续。').then((res) => { api.next(null, res) })) === 'exit') return
  let id = yield readSyncByRl('输入你的 Telegram 数字 ID：').then((res) => { api.next(null, res) })
  if (id === '') {
    console.log('你没有输入任何信息。')
    console.log(' ')
    return
  }
  console.log(' ')
  console.log('请稍候，正在发送测试消息...')
  let randomNumber = Math.floor((Math.random() * 10000)) + ''
  let loop = true
  do {
    if (randomNumber.length >= 4) loop = false
    else randomNumber = '0' + randomNumber
  } while (loop)
  let res
  try {
    res = yield request.post({url: `https://api.telegram.org/bot${token}/sendMessage`, form: {
      chat_id: id,
      text: `请将验证码 ${randomNumber} 输入到下一提示中，完成快递 bot 的配置工作。`
    }}, (err, httpResponse, body) => { api.next(err, { httpResponse, body }) })
  } catch (e) {
    console.log(`请求时出现错误。`)
  }
  res.body = JSON.parse(res.body)
  if (!res.body.ok){
    console.log('啊哦！请求失败了。')
    console.log(`Telegram 返回的问题描述是：${res.body.description}`)
    console.log(`可能是因为你的 token 和 ID 输入错误`)
    console.log(`或是你还没有主动 /start 你的 bot`)
    console.log(` `)
    return
  }
  if ((yield readSyncByRl('请输入你刚才收到的 4 位验证码：').then((res) => { api.next(null, res) })) !== randomNumber) {
    console.log('输入错误...')
    console.log(' ')
    return
  }
  console.log('写入 config.js 文件中...')
  fs.writeFileSync('config.js', `module.exports = {\n  telegram: {\n    bot_token: '${token}',\n    user_id: ${id}\n  }\n}\n`)
  console.log('检查新 config.js 文件是否可被正确读取...')
  if (!require('./config').telegram.bot_token === token) throw new Error('文件写入失败！请检查是否有足够权限。')
  if (!require('./config').telegram.user_id === id) throw new Error('文件写入失败！请检查是否有足够权限。')
  console.log('恭喜你！config.js 已完成配置。请继续配置流程。')
  callback(null, null)
})}

function setScript(callback) {sync(function* (api) {
  let res
  try { res = yield Process.exec('ls -A ~', (error, stdout, stderr) => { api.next(error, { stdout, stderr}) })} catch(e) {console.log(e.Error); return; }
  if (res.stdout.indexOf('.termux') === -1) try { yield Process.exec('mkdir ~/.termux', (error, stdout, stderr) => { api.next(error, { stdout, stderr}) })} catch(e) {console.log(e.Error); return; }
  try { res = yield Process.exec('ls ~/.termux', (error, stdout, stderr) => { api.next(error, { stdout, stderr}) })} catch(e) {console.log(e.Error); return; }
  if (res.stdout.indexOf('tasker') === -1) try { yield Process.exec('mkdir ~/.termux/tasker', (error, stdout, stderr) => { api.next(error, { stdout, stderr}) })} catch(e) {console.log(e.Error); return; }
  try { res = yield Process.exec('echo "cd ~/termux-deilveryreader && npm run recive" > ~/.termux/tasker/db-recivesms && echo "cd ~/termux-deilveryreader && npm run send" > ~/.termux/tasker/db-sendreminder', (error, stdout, stderr) => { api.next(error, { stdout, stderr}) })} catch(e) {console.log(e.Error); return; }
  callback(null, null)
})}
