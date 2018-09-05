let fs = require('fs')
let debug = require('debug')('recive:recive.js')
const process = require('child_process')
process.exec('termux-sms-list -l 1', (error, stdout, stderr) => {
	if (error !== null) {
	  throw new Error('执行时出现错误：' + error);
    return
	}
  let newSMS = JSON.parse(stdout)[0]
  let code, position, company
  if (newSMS.body.match(/【丰巢】/g)) {
    code = newSMS.body.match(/[0-9]{8}/g)[0]
    position = newSMS.body.match(/至.*取/g)[0].slice(1, -1)
    company = newSMS.body.match(/取(?!(件码)).*的包裹/g)[0].slice(1, -3)
  } else if (newSMS.body.match(/【速递易】/g)) {
    code = newSMS.body.match(/凭密码([a-z]|[A-Z]|[0-9]){6}到/g)[0].slice(3, -1)
    position = newSMS.body.match(/到.*取/g)[0].slice(1, -1)
    company = newSMS.body.match(/取.*包裹/g)[0].slice(1, -2)
  }
  if (!code) return
  let data = fs.readFileSync('deilveryData')
  debug(data.toString())
  fs.writeFile('deilveryData', data.toString() + `👉 来自 ${company} 的取件码为 ${code} 包裹，请到 ${position} 领取\n`,  (err)=> {
    if (err) throw new Error(err);
  })
});
