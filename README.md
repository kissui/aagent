# 红包第二版前端项目 - BOSS 端

为了公用代码，目前新版 BOSS 端也放到 redpacket-fe 项目中

Universal/Isomorphic React

## TODO
1. build 后放到 dist 目录，仅 dist 对 nginx 开放

## ES2015

本项目中用到了一些 ES2015（ES6）的语法，主要为：

* let（块作用域变量，一般可替代 var）+ const（常量，命名用全大写）
* 模块（import/export）
* Arrow Functions（=>）

ES2015 的用法详见：

* https://babeljs.io/docs/learn-es2015/ 教程
* https://github.com/airbnb/javascript 代码规范

## 使用的库

* [express - 4.x](https://github.com/strongloop/express) on the server side
* [react-engine - 3.x](https://github.com/paypal/react-engine) as the express view render engine
* [react - 0.14.x](https://github.com/facebook/react) for building the UI
* [react-router - 1.x](https://github.com/rackt/react-router) for UI routing
  * 1.x 为老版本，文档见：https://github.com/reactjs/react-router/blob/1.0.x/docs/API.md
* [webpack - 1.x](https://github.com/webpack/webpack) as the client side module loader
* [babel - 6.x](https://github.com/babel/babel) for compiling the ES6/JSX code
* [axios](https://github.com/mzabriskie/axios) 用来做 HTTP 请求
* ~~[fetch](http://github.github.io/fetch/) 用来做 HTTP 请求~~


## 开发方式
```shell
$ npm start
# 会同时开启
# webpack -d -w
# 和
# nodemon

```


## 部署方式
```shell
# cd `into_this_dir`
$ npm install
$ npm run build
$ node index.js
$ open http://localhost:3000
```

可以用 [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer) 来分析 webpack 后 bundle.js 的内容，看带宽都去哪儿了。该命令已封装为 `npm run size-analyze`。不过 `size-analyzer` 只能分析 uglify 之前的代码，详见 [文档](https://github.com/robertknight/webpack-bundle-size-analyzer#important-note-about-minification)


## 常用代码
## Class
```javascript
# 使用 ES6 Class 的方式写组件
export class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
    this.tick = this.tick.bind(this);
  }
  tick() {
    this.setState({count: this.state.count + 1});
  }
  render() {
    return (
      <div onClick={this.tick}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };

```
### 跳转
```javascript
# 对于 view
import { withRouter } from 'react-router'

class Example extends React.Component {
   // use `this.props.router.push('/some/path')` here
};

// Export the decorated class
var DecoratedExample = withRouter(Example);

// PropTypes
Example.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

# 对于一般组件
import { browserHistory } from 'react-router'

browserHistory.push('/some/path')
```

## App 对接说明
React 版与之前的“总是白屏版”是不同的服务，SDK 接入时需要做以下修改：

1. 修改后端地址
   1. 测试环境：http://121.42.52.69:3001 -> http://121.42.52.69:3002
   3. 正式环境：暂未部署
   2. Next 环境：暂未部署
2. 修改获取 token 的地址：
   1. 通过签名获取 token：POST /api/auth-token -> POST /token/sign
   2. 通过环信获取 token：POST /api/hx-auth-token -> POST /token/easemob
3. 修改跳转到 HTML 的链接：
   1. 零钱明细页：/app/bills
   2. QA 页：/app/qa
   3. 协议页：/app/register/agreement

## 数据埋点
本项目会按 json 格式在 `logs/track.log` 中记录以下数据：

1. API 代理日志
  1. 该类日志 name 为 `rp.api.call`
  2. request 表示请求的接口，接口意义详见 be-ng 接口文档
  3. status 表示成功 `succeeded` 或失败 `failed`
  4. uid、did、duid 表示用户身份
  5. ua、device_id、ip、为设备信息
  ```json
  // 成功
  {
    "name":"rp.api.call",
    "request":"GET /api/hongbao/payment/money",
    "status":"succeeded",
    "uid":106,
    "did":13,
    "duid":"toksea",
    "ua":"ChatDemo-UI3.0/1.0 (iPhone; iOS 9.3.1; Scale/2.00)",
    "device_id":"867993022372781",
    "ip":"111.200.192.66",
    "server_timestamp":1463647206228
  }
  // 失败
  {
    "name":"rp.api.call",
    "request":"POST /api/hongbao/payment/recharge-request",
    "errorStatus":200,
    "errorCode":"100",
    "errorMsg":"持卡人证件号不正确[EES0017]",
    "status":"failed",
    "uid":0,
    "did":13,
    "duid":"topcmm",
    "ua":"Dalvik/2.1.0 (Linux; U; Android 5.0.2; X900+ Build/CEXCNFN5501304131S)",
    "ip":"180.166.126.162",
    "server_timestamp":1463645591583
  }
  // 失败
  {
    "name":"rp.api.call",
    "request":"POST /api/auth-token",
    "errorStatus":404,
    "status":"failed",
    "uid":0,
    "did":0,
    "duid":0,
    "ua":"Dalvik/2.1.0 (Linux; U; Android 5.1.1; MX4 Pro Build/LMY48W)",
    "ip":"111.200.192.66",
    "server_timestamp":1463646471823
  }
  ```
2. App 上报的错误日志
  1. 该类日志 name 为 `rp.error.be`（表示后端通信出错）或 `rp.error.webview`（表示 WebView 出错）
  2. `url`、`errorMsg` 为具体错误信息
  3. `timestamp` 为出错时客户端时间（日志可能积累多条后一起发）
  4. uid、did、duid 表示用户身份
  5. ua、device_id、ip、为设备信息
  ```json
  {
    "name":"rp.error.be",
    "errorMsg":"网络错误",
    "url":"https://rpv2.easemob.com/api/hongbao/receive",
    "timestamp":1463636170631,
    "uid":896,
    "did":13,
    "duid":"yanhutz",
    "ua":"ChatDemo-UI3.0/1.0 (iPhone; iOS 9.3.1; Scale/2.00)",
    "ip":"111.200.192.66",
    "server_timestamp":1463636170751
  }
  ```

另外，日志在文件中格式说明如下：
1. 一行为一次记录，为一个 json
2. 每行 json 的 logs 为一个数组，数组中是此次记录的各条日志

## 红包业务分支
* 发单聊红包
    * 金额
        * 最大 200（后端）
        * >= 0.01
    * 祝福语
        * 可切换（后端配置）
        * 祝福语长度有限制（固定中文30个字）
* 支付 modal
    * 支付方式
        * modal 中只显示一种
        * 点击后在选择 modal 中选择
    * 使用零钱
        * 零钱为 0 时不显示
        * 零钱金额 < 发的金额，置灰，显示，同时显示“支付选择框”（银行卡、添加银行卡）
        * 零钱金额 >= 发的金额，选中
        * 没密码时，显示“本次交易免密”，确定按钮
            * 此时如果超过 200 限额（根据后端报错），弹提示（见图），可取消或确定
            * 确定就跳到绑卡流程
            * 但回去后，还是零钱发
        * 使用零钱且设置过支付密码，显示支付密码
        * 支付密码纯数字，六位
        * 输入密码正确时，自动提交
        * 错误时，清空报错
    * 现有银行卡
        * 首选银行卡，或在选择 modal 中选了银行卡后，自动调用发短信接口
        * 显示验证码
        * 纯数字，六位
        * 错误时，清空报错
        * 正确时，自动提交
    * 添加银行卡
        * 仅尚无银行卡时显示
        * 点击就跳到“添加银行卡”流程
* 添加银行卡
    * 分为“添加后直接支付”、“只验卡”
    * 卡号
        * 输入 6 位后，调用后端验卡接口，接口会返回卡号长度、银行，限制长度，显示银行
        * 输入位数够后，显示姓名等信息，并直接跳到下一项
        * 输错，报错
        * 输对，继续流程
            * 如果是从“支付”来的，自动发验证短信
        * 保险协议 和 用户协议
            * 仅第一次添加银行卡（即注册：第一次加支付卡、第一次加提现卡）时显示
            * 要注意环信还是云账户
* 忘记密码
    * 首先验证身份
        * 与添加银行卡相同
        * 不应显示用户协议（与现有 app 实现不同）
    * 之后验证短信（新页面，也可弹 modal，总之之前填的信息就不能改了）
    * 再之后跳到“设置支付密码”页面
    * 完成“设置支付密码”后，回到入口（支付、零钱页等）
* 设置支付密码
    * 一共 2 次
    * 如果跟第一次不一致，清空，重新输第一个
* 提现
    * 如果没有银行卡，点零钱页的提现按钮，先弹对话框，点击后跳到 添加银行卡
    * 只有一张银行卡
    * 是否完善过卡信息，在第一个页面没区别
    * 输入金额不对时，报错，清空
    * 金额对时，继续
        * 如果未完善过卡信息，完善卡信息
        * 弹支付密码
    * 支付密码输错清空报错
    * 正确 flash 信息，回到零钱页
* 完善卡信息
    * 卡号隐藏：显示“招商银行（1234）”也可接受
    * 省市开户行，与一版保持一直就行
    * 选完就通过
* header
    * 需要有 header，来展示 title、取消等按钮
    * 可以最后做
* 收红包
    * 无效
        * 已失效弹窗
    * 已拆
        * 详情页
    * 未拆
        * 发送者
            * 详情页
        * 接收者点击
            * 拆红包弹窗
            * 无效
                * 已失效弹窗
* 详情页
    * 等待被领取，或领取列表
* 拆红包弹窗
    * 拆成功
        * 发反馈消息，接收、发送都能收到
            * 你领取了 xxx 发的红包
            * xxx 领取了你的红包
        * 跳“详情页”
    * 拆失败（被抢），@TODO
    * 拆失败（失效），变为“已失效弹窗”
* 已失效弹窗

## 参考
* https://github.com/paypal/react-engine/tree/master/example
