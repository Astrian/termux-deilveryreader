let fs = require('fs')
let debug = require('debug')('recive:recive.js')
const process = require('child_process')
process.exec('termux-sms-list -l 1', (error, stdout, stderr) => {
	if (error !== null) {
	  throw new Error('执行时出现错误：' + error);
    return
	}
  let newSMS = JSON.parse(stdout)[0]
  newSMS.body = '【丰巢】您的快递24h未领，关注丰巢智能柜微信绑定取件手机，激活取件码『25779634』后至嘉朗湖畔13座架空层丰巢智能快递柜领取快递，派件员电话13517654377。'
  let code = 0, position, company
  if (newSMS.body.match(/【丰巢】/g)) {
    if (newSMS.body.match(/您的快递24h未领/g)) {
      code = newSMS.body.match(/[0-9]{8}/g)[0]
      position = newSMS.body.match(/后至.*领取/g)[0].slice(2, -2)
      company = 0
    } else {
      code = newSMS.body.match(/[0-9]{8}/g)[0]
      position = newSMS.body.match(/至.*取/g)[0].slice(1, -1)
      company = newSMS.body.match(/取(?!(件码)).*的包裹/g)[0].slice(1, -3)
    }
  }
  else if (newSMS.body.match(/【速递易】/g)) {
    code = newSMS.body.match(/凭密码([a-z]|[A-Z]|[0-9]){6}到/g)[0].slice(3, -1)
    position = newSMS.body.match(/到.*取/g)[0].slice(1, -1)
    company = newSMS.body.match(/取.*包裹/g)[0].slice(1, -2)
  }
  if (code === 0) return
  let data = fs.readFileSync('deilveryData')
  debug(data.toString())
  fs.writeFile('deilveryData', data.toString() + `👉 ${company === 0 ? '' : `来自 ${company} 的`}取件码为 ${code} 包裹，请到 ${position} 领取\n`,  (err)=> {
    if (err) throw new Error(err);
  })
});
