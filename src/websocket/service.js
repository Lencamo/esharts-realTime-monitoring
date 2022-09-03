export default class SocketService {
  /**
   * 单例设计模式
   */

  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 连接服务器
  ws = null

  connected = false
  sendRetryNum = 0

  serviceConnectFn() {
    if (!window.WebSocket) {
      console.log('您的浏览器不支持websocket')
    }

    // 提升ws作用域
    this.ws = new WebSocket('ws://127.0.0.1:9191')

    this.ws.onopen = () => {
      console.log('连接服务端成功')

      this.connected = true
    }

    // ✨接收服务端数据
    this.ws.onmessage = (msg) => {
      // console.log('前端发送的数据：' + msg.data)
      const receiveData = JSON.parse(msg.data)
      const socketType = receiveData.socketType

      // 回调函数是否存在
      if (this.callbackMapData[socketType]) {
        const action = receiveData.action

        if (action === 'getData') {
          const chartData = JSON.parse(receiveData.data)

          // .call的使用👀（数据存储）（Function.prototype.call()）
          // 通过call可接受参数的接收参数的方式为组件中的get__Data(ret)传送数据
          this.callbackMapData[socketType].call(this, chartData)
        } else if (action === 'fullScreen') {
          console.log('全屏展示数据')
        } else if (action === 'themeChange') {
          console.log('主题切换数据')
        }
      }
    }

    this.ws.onclose = () => {
      console.log('连接服务端失败')

      this.connected = false
    }
  }

  // 服务端数据处理 —— 组件中调用
  // 数据存储（往里面存储一个回调函数callBack【组件中的get__Data()函数】）（该回调函数的唯一标识为socketType）
  callbackMapData = {}
  // 1、回调函数注册
  regCallback(socketType, callBack) {
    this.callbackMapData[socketType] = callBack
  }

  // 2、回调函数注销
  unregCallback(socketType) {
    this.callbackMapData[socketType] = null
  }

  // ✨发送数据
  sendFn(data) {
    // this.ws.send(JSON.stringify(data))

    // 解决bug：Failed to execute 'send' on 'WebSocket': Still in CONNECTING state."
    if (this.connected) {
      this.ws.send(JSON.stringify(data))

      this.sendRetryNum = 0
    } else {
      this.sendRetryNum++

      setTimeout(() => {
        this.ws.send(JSON.stringify(data))
      }, this.sendRetryNum * 500)
    }
  }
}
