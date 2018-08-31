let fs = require('fs')
let debug = require('debug')('recive:recive.js')
const process = require('child_process')
process.exec('termux-sms-list -l 1', (error, stdout, stderr) => {
	if (error !== null) {
	  throw new Error('执行时出现错误：' + error);
    return
	}
  let newSMS = JSON.parse(stdout)[0]
  if(!newSMS.body.match(/【丰巢】/g)) return
  let code = newSMS.body.match(/[0-9]{8}/g)[0]
  let position = newSMS.body.match(/至.*取/g)[0].slice(1, -1)
  let company = newSMS.body.match(/取(?!(件码)).*的包裹/g)[0].slice(1, -3)
  debug(code)
  debug(position)
  debug(company)
  let data = fs.readFileSync('deilveryData')
  debug(data.toString())
  fs.writeFile('deilveryData', data.toString() + `👉 来自 ${company} 的编号为 ${code} 包裹，请到 ${position} 领取\n`,  (err)=> {
    if (err) throw new Error(err);
  })
});
