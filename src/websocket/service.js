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

  serviceConnectFn() {
    if (!window.WebSocket) {
      console.log('您的浏览器不支持websocket')
    }

    // 提升ws作用域
    this.ws = new WebSocket('ws://127.0.0.1:9191')

    this.ws.onopen = () => {
      console.log('连接服务端成功')
    }

    this.ws.onmessage = (msg) => {
      console.log('前端发送的数据：' + msg.data)
    }

    this.ws.onclose = () => {
      console.log('连接服务端失败')
    }
  }
}
