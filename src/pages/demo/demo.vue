<route lang="json5">
{
  style: {
    navigationBarTitleText: 'demo',
  },
}
</route>

<template>
  <view>
    123
    <view>
      <block v-for="(item, index) in blueDeviceData" :key="index">
        <view class="conntent-box">
          <view>
            蓝牙设备--{{ item.deviceName }}
            <block v-if="item.isSucess">√</block>
          </view>
          <view
            class="handle-content-box"
            @tap="handleConnect"
            :data-blueId="item.deviceId"
            :data-bluename="item.deviceName"
          >
            连接
          </view>
        </view>
      </block>
    </view>
    <block v-if="isWifiValue == 'NoWificonnected'">
      <view>
        <input type="text" placeholder="请输入wifi名字" @input="handleWifiUsername" />
        <input type="text" placeholder="请输入密码" @input="handleWifiPassword" />
      </view>
      <button @tap="sumbitPost">输入账号密码</button>
    </block>
  </view>
</template>

<script>
// pages/demo/demo.js
export default {
  data() {
    return {
      deiveName: '',
      deviceId: '',
      isWifiValue: '',
      wifiUsername: '',
      wifiPassword: '',
      deviceUUid: '',
      isSucess: false,
      blueDeviceData: [],
      connected: false,
      deviceName: '',
      demodata: '',
    }
  },
  onShow() {
    if (!this.deviceId && !this.deviceUUid) {
      this.initBluetoothAdapter()
    }
  },
  onShareAppMessage() {},
  methods: {
    initBluetoothAdapter: function () {
      const that = this
      uni.openBluetoothAdapter({
        success: function (res) {
          console.log(res)
          that.startDiscovery() // 初始化成功后开始扫描
        },
        fail: function (res) {},
      })
    },

    createBLEConnection(e) {
      const deviceId = this.deviceId
      const _that = this
      uni.createBLEConnection({
        deviceId: _that.deviceId,
        success: (res) => {
          this.setData({
            connected: true,
            deviceId,
          })
          uni.stopBluetoothDevicesDiscovery()
          uni.getBLEDeviceServices({
            deviceId: _that.deviceId,
            // 搜索到设备的 deviceId
            success: (res) => {
              for (let i = 0; i < res.services.length; i++) {
                if (res.services[i].isPrimary) {
                  // 可根据具体业务需要，选择一个主服务进行通信
                  _that.setData({
                    deviceUUid: res.services[i].uuid,
                  })
                }
              }
            },
          })
          this.handleSend()
          // this.getBLEDeviceServices(deviceId)
        },
      })
    },

    //连接蓝牙
    startDiscovery: function () {
      console.log('设备连接蓝牙')
      let that = this
      uni.startBluetoothDevicesDiscovery({
        success: function (res) {
          const blueDevice = []
          const map = new Map()
          that.onDeviceFound = function (devices) {
            // 假设你已知ESP32的蓝牙名称，这里只是示例代码，你可能需要遍历devices数组来找到ESP32
            for (let i = 0; i < devices.devices.length; i++) {
              console.log(devices.devices[i].name)
              if (devices.devices[i].name.length > 1) {
                blueDevice.push({
                  deviceName: devices.devices[i].name,
                  deviceId: devices.devices[i].deviceId,
                  isSucess: false,
                })
              }

              // const newArr =blueDevice.filter(v => !map.has(v.deviceName) && map.set(v.deviceName, v));
              // 停止扫描并连接ESP32
              that.setData({
                blueDeviceData: blueDevice,
              })
              break
            }
          }
          uni.onBluetoothDeviceFound(that.onDeviceFound) // 监听找到新设备的事件
        },
        fail: function (res) {},
      })
    },

    hexStringToAscii(hexStr) {
      // 确保输入字符串的长度是偶数
      // if (hexStr.length % 2 !== 0) {
      //     throw new Error('无效的十六进制字符串长度');
      // }

      let asciiStr = ''
      for (let i = 0; i < hexStr.length; i += 2) {
        // 获取两个字符的十六进制数
        let hexByte = hexStr.substr(i, 2)
        // 转换为十进制数
        let decimalByte = parseInt(hexByte, 16)
        // 将十进制数转换为ASCII字符
        asciiStr += String.fromCharCode(decimalByte)
      }
      return asciiStr
    },

    handleSend() {
      const _that = this
      uni.getBLEDeviceCharacteristics({
        deviceId: _that.deviceId,
        serviceId: _that.deviceUUid,
        success: (res) => {
          for (let i = 0; i < res.characteristics.length; i++) {
            let item = res.characteristics[i]
            if (item.properties.write) {
              // 该特征值可写
              // 本示例是向蓝牙设备发送一个 0x00 的 16 进制数据
              // 实际使用时，应根据具体设备协议发送数据
              // const data = new Uint8Array([0x6c, 0x69, 0x67, 0x68, 0x74, 0x31, 0x6f, 0x6e]); // 假设这是"light1on"的UTF-8编码的16进制表示
              // const buffer = wx.base64.arrayBufferToBase64(data.buffer); // 转换为base64，因为微信小程序API可能需要base64格式
              let str = 'isWifi'

              // 创建一个足够大的ArrayBuffer来存储ASCII码值
              // 每个字符需要一个字节，所以总长度是字符串的长度
              let buffer = new ArrayBuffer(str.length)

              // 创建一个DataView来操作ArrayBuffer
              let dataView = new DataView(buffer)

              // 遍历字符串中的每个字符，并将其ASCII码值写入ArrayBuffer
              for (let i = 0; i < str.length; i++) {
                // 获取字符的ASCII码值（0-255）
                let asciiCode = str.charCodeAt(i)
                // 使用DataView的setUint8方法将ASCII码值写入ArrayBuffer的指定位置
                dataView.setUint8(i, asciiCode)
              }
              uni.writeBLECharacteristicValue({
                deviceId: _that.deviceId,
                serviceId: _that.deviceUUid,
                characteristicId: item.uuid,
                value: buffer,
              })
            }
            if (item.properties.read) {
              // 改特征值可读
              uni.readBLECharacteristicValue({
                deviceId: _that.deviceId,
                serviceId: _that.deviceUUid,
                characteristicId: item.uuid,
              })
            }
            if (item.properties.notify || item.properties.indicate) {
              // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
              uni.notifyBLECharacteristicValueChange({
                deviceId: _that.deviceId,
                serviceId: _that.deviceUUid,
                characteristicId: item.uuid,
                state: true,
              })
              uni.onBLECharacteristicValueChange(function (res) {
                var asciiChar = _that.hexStringToAscii(_that.ab2hex(res.value))
                console.log(asciiChar)
                _that.setData({
                  isWifiValue: asciiChar,
                })
                _that.isWifiConnected()
              })
            }
          }
        },
      })
    },

    isWifiConnected() {
      if (this.isWifiValue == 'NoWificonnected') {
        uni.showToast({
          title: '此设备暂未连接wifi',
          icon: 'error',
          duration: 2000,
        })
      }
    },

    ab2hex(buffer) {
      let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      })
      return hexArr.join('')
    },

    handleWifiUsername(e) {
      this.setData({
        wifiUsername: e.detail.value,
      })
    },

    sumbitPost() {
      uni.showToast({
        title: '正在连接wifi中',
        mask: true,
        icon: 'loading',
      })
      this.sendMsg(this.wifiUsername + ';' + this.wifiPassword)
    },

    handleConnect(e) {
      const _that = this
      const blueId = e.target.dataset.blueid
      uni.createBLEConnection({
        deviceId: e.target.dataset.blueid,
        success: (res) => {
          this.setData({
            connected: true,
            deviceId: e.target.dataset.blueid,
            deviceName: e.target.dataset.bluename,
          })
          console.log('连接成功')
          uni.stopBluetoothDevicesDiscovery()
          uni.getBLEDeviceServices({
            deviceId: e.target.dataset.blueid,
            // 搜索到设备的 deviceId
            success: (res) => {
              for (let i = 0; i < res.services.length; i++) {
                if (res.services[i].isPrimary) {
                  // 可根据具体业务需要，选择一个主服务进行通信
                  _that.setData({
                    deviceUUid: res.services[i].uuid,
                  })
                }
              }
              this.handleSend()
            },
          })
          uni.showToast({
            title: '连接成功蓝牙',
            icon: 'success',
            success() {
              _that.blueDeviceData.forEach((v) => {
                console.log(v)
                if (v.deviceId == blueId) {
                  v.isSucess = true
                }
              })
              _that.setData({
                blueDeviceData: _that.blueDeviceData,
              })
            },
          })
          // this.getBLEDeviceServices(deviceId)
        },
      })
    },

    handleWifiPassword(e) {
      this.setData({
        wifiPassword: e.detail.value,
      })
    },

    createBLEConnection(e) {},

    sendMsg(e) {
      const _that = this
      uni.getBLEDeviceCharacteristics({
        deviceId: _that.deviceId,
        serviceId: _that.deviceUUid,
        success: (res) => {
          for (let i = 0; i < res.characteristics.length; i++) {
            let item = res.characteristics[i]
            if (item.properties.write) {
              // 该特征值可写
              // 本示例是向蓝牙设备发送一个 0x00 的 16 进制数据
              // 实际使用时，应根据具体设备协议发送数据
              // const data = new Uint8Array([0x6c, 0x69, 0x67, 0x68, 0x74, 0x31, 0x6f, 0x6e]); // 假设这是"light1on"的UTF-8编码的16进制表示
              // const buffer = wx.base64.arrayBufferToBase64(data.buffer); // 转换为base64，因为微信小程序API可能需要base64格式
              let str = e
              // 创建一个足够大的ArrayBuffer来存储ASCII码值
              // 每个字符需要一个字节，所以总长度是字符串的长度
              let buffer = new ArrayBuffer(str.length)
              // 创建一个DataView来操作ArrayBuffer
              let dataView = new DataView(buffer)
              // 遍历字符串中的每个字符，并将其ASCII码值写入ArrayBuffer
              for (let i = 0; i < str.length; i++) {
                // 获取字符的ASCII码值（0-255）
                let asciiCode = str.charCodeAt(i)
                // 使用DataView的setUint8方法将ASCII码值写入ArrayBuffer的指定位置
                dataView.setUint8(i, asciiCode)
              }
              uni.writeBLECharacteristicValue({
                deviceId: _that.deviceId,
                serviceId: _that.deviceUUid,
                characteristicId: item.uuid,
                value: buffer,
              })
            }
            if (item.properties.read) {
              // 改特征值可读
              uni.readBLECharacteristicValue({
                deviceId: _that.deviceId,
                serviceId: _that.deviceUUid,
                characteristicId: item.uuid,
              })
            }
            if (item.properties.notify || item.properties.indicate) {
              // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
              uni.notifyBLECharacteristicValueChange({
                deviceId: _that.deviceId,
                serviceId: _that.deviceUUid,
                characteristicId: item.uuid,
                state: true,
              })
              uni.onBLECharacteristicValueChange(function (res) {
                var asciiChar = _that.hexStringToAscii(_that.ab2hex(res.value))
                _that.setData({
                  demodata: asciiChar,
                })
              })
            }
          }
        },
      })
    },
  },
}
</script>
<style scoped>
/* pages/demo/demo.wxss */
.conntent-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
}
.handle-content-box {
  display: flex;
  align-items: center;

  justify-content: center;
  width: 150rpx;
  height: 60rpx;
  border: 1px solid cadetblue;
  border-radius: 30rpx;
}
</style>
