# 快递箱取件短信提醒助理
收到快递箱发来的取件通知时，可以自动帮你静默存储。当你到达家附近范围时，会自动发送一条 Telegram 通知。

![收到的 Telegram 消息示例](https://ws1.sinaimg.cn/large/866b9388gy1fusovholdqj20u00edwhr.jpg)

## 适用场景
目前适用于来自丰巢、速递易具有以下模板的快递箱通知短信，其中加粗部分为程序提取信息。

> 【丰巢】凭取件码『**12345678**』至 **四轩茶屋勒布朗咖啡店旁快递箱** 取 **幻影快递** 的包裹！

> 【丰巢】您的快递24h未领，关注丰巢智能柜微信绑定取件手机，激活取件码『**12345678**』后至 **四轩茶屋勒布朗咖啡店旁快递箱** 领取快递，派件员电话13000000000。

> 【速递易】凭密码 **AB1234** 到 **四轩茶屋勒布朗咖啡店旁快递箱** 取 **幻影快递** 包裹，超24小时收费，投递员13000000000

~~不要在意有什么奇怪的东西混进来了~~

*丰巢的逾期短信可以不用理会微信绑定的提示，实际使用中可直接使用取件码进行取件。*

## 使用前准备
- 你的日常使用机器为 Android 手机
- 在 Android 手机上安装这些 app：
	- [Termux](https://termux.com/)
	- [Termux:Task](https://play.google.com/store/apps/details?id=com.termux.tasker) ($1.99)
	- [Termux:API](https://play.google.com/store/apps/details?id=com.termux.api)
	- [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm) ($2.99)
- 在 Telegram 联系 [BotFather](https://t.me/botfather)，使用 `/newbot` 指令新建一个 bot

## 懒人超快安装法
1. 安装上述 app
2. 启动 Termux，执行 `pkg install curl && sh -c "$(curl -fsSL https://raw.github.com/Astrian/termux-deilveryreader/master/install.sh)"`
3. 根据屏幕提示完成初始化
4. 在 Tasker 中分别建立两个任务：一个是收到短信时执行 Termux `db-recivesms` 脚本，另一个是到某个地理位置或连接某个 Wi-Fi 之后执行 Termux `db-sendreminder` 脚本
5. 准备收快递吧

## 手动配置方法
1. 安装上述 app
2. 在 Termux 中安装 Git 和 Node.js
3. `git clone https://github.com/Astrian/termux-deilveryreader` 或者 `git clone https://gitlab.com/Astrian/termux-deilveryreader`
4. `cd termux-deilveryreader && npm install`
5. `cp config.sample.js config.js && vi config.js`，并将你的 bot token 和你的 Telegram 数字 ID（[点我获取](https://t.me/get_id_bot)）填入
6. `mkdir ~/.termux/tasker && cp db-recivesms ~/.termux/tasker/ && cp db-sendreminder ~/.termux/tasker/`
7. 在 Tasker 中分别建立两个任务：一个是收到短信时执行 Termux `db-recivesms` 脚本，另一个是到某个地理位置或连接某个 Wi-Fi 之后执行 Termux `db-sendreminder` 脚本（由于刚才已经复制到 `~/.termux/tasker` 文件夹中，因此输入「db」时应该会自动联想出来）
8. 准备收快递吧

## 注意事项
目前只支持丰巢和速递易快递箱的短信模板。如果需要其他快递箱短信读取功能，你可以：

- 自己写好正则，PR 到 `dev` 分支（先不要直接 PR 到 `master`，我想先把代码处理好再 PR）
- 把新模板作为 issue 提给我

## 协议
MIT
