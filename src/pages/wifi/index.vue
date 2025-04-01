<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '网络配置',
  },
}
</route>
<template>
  <view class="container">
    <!-- 直接将背景图片设置在.container上 -->
    <view class="content">
      <view
        :style="{
          height: `${searchHeight}px`,
          paddingTop: `${statusBarHeight}px`,
          lineHeight: `${searchHeight}px`,
        }"
      >
        <wd-row>
          <wd-col :span="8">
            <view class="pl-4" @click="handleBack">
              <wd-icon name="thin-arrow-left" size="18px" color="#FFFF"></wd-icon>
            </view>
          </wd-col>
          <wd-col :span="8">
            <view class="text-center color-white font-700 font-size-4">网络配置</view>
          </wd-col>
          <wd-col :span="8"></wd-col>
        </wd-row>
      </view>

      <view class="m-6 bg-red p-4 b-r">
        <scroll-view scroll-y="true" class="h-50">
          <view v-for="item in wifiList" :key="item">
            <view class="p-2 text-black bg-gray-100 m-1">
              <view @click="handleSelectWifi" :data-wifiName="item.SSID">{{ item.SSID }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="color-white font-size-4 m-4">
        <view class="m-4">网络名称</view>
        <input
          v-model="wifiName"
          placeholder="请选择wifi"
          placeholder-class="color-white"
          class="b-white b-1px b-solid p-2 m-2"
        />
      </view>
      <view class="color-white font-size-4 m-4">
        <view class="m-4">网络密码</view>
        <input
          type="password"
          v-model="wifiPass"
          placeholder="请选择wifi"
          placeholder-class="color-white"
          class="b-white b-1px b-solid p-2 m-2"
        />
      </view>
      <view class="mt-10 flex justify-center">
        <CommonButton text="提交" @onClick="addDevice"></CommonButton>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onReady } from '@dcloudio/uni-app'
const searchHeight = ref()
const statusBarHeight = ref()
const wifiName = ref()
const wifiPass = ref()
const deviceName = ref()
const deviceId = ref()
const deviceUUid = ref()
const isWifiValue = ref()

const hexStringToAscii = (hexStr) => {
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
}

onReady(() => {
  deviceId.value = e.deviceId
  deviceName.value = e.deviceName
  console.log('onReady....')
  const height = uni.getSystemInfoSync().statusBarHeight
  console.log('height:', height)
  statusBarHeight.value = height // 状态栏高度
  const btnInfo = uni.getMenuButtonBoundingClientRect()
  searchHeight.value = btnInfo.height + (btnInfo.top - statusBarHeight.value) * 2 // 搜索框父元素高度
})

const wifiList = ref([])

const handleBack = () => {
  uni.navigateBack()
}

const createBLEConnection = (e) => {
  uni.createBLEConnection({
    deviceId: deviceId.value,
    success: (res) => {
      uni.stopBluetoothDevicesDiscovery()
      uni.getBLEDeviceServices({
        deviceId: deviceId.value,
        // 搜索到设备的 deviceId
        success: (res) => {
          for (let i = 0; i < res.services.length; i++) {
            if (res.services[i].isPrimary) {
              // 可根据具体业务需要，选择一个主服务进行通信
              deviceUUid.value = res.services[i].uuid
            }
          }
        },
      })
      // handleSend();
      // this.getBLEDeviceServices(deviceId)
    },
  })
}

const ab2hex = (buffer) => {
  let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
    return ('00' + bit.toString(16)).slice(-2)
  })
  return hexArr.join('')
}

onLoad((e) => {
  console.log(e.deviceUUid)
  deviceId.value = e.deviceId
  deviceName.value = e.deviceName
  deviceUUid.value = e.deviceUUid
  wifiList.value = [
    {
      SSID: 'shentongWiFi',
      BSSID: 'e8:13:6e:f6:9a:84',
      secure: true,
      signalStrength: 72,
      frequency: 2437,
    },
    {
      SSID: 'shentongGuest',
      BSSID: 'e8:13:6e:f6:9a:85',
      secure: false,
      signalStrength: 72,
      frequency: 2437,
    },
    {
      SSID: 'shentongInter',
      BSSID: 'e8:13:6e:f6:9a:83',
      secure: true,
      signalStrength: 70,
      frequency: 2437,
    },
    {
      SSID: 'shentongInter',
      BSSID: 'b0:76:1b:27:29:83',
      secure: true,
      signalStrength: 46,
      frequency: 2437,
    },
    {
      SSID: 'shentongWiFi',
      BSSID: 'b0:76:1b:27:29:84',
      secure: true,
      signalStrength: 35,
      frequency: 2437,
    },
    {
      SSID: 'shentongGuest',
      BSSID: 'b0:76:1b:27:29:85',
      secure: false,
      signalStrength: 35,
      frequency: 2437,
    },
    {
      SSID: 'shentongGuest',
      BSSID: 'e8:13:6e:f6:9a:95',
      secure: false,
      signalStrength: 68,
      frequency: 5200,
    },
    {
      SSID: 'shentongInter',
      BSSID: 'e8:13:6e:f6:9a:93',
      secure: true,
      signalStrength: 68,
      frequency: 5200,
    },
    {
      SSID: 'shentongWiFi',
      BSSID: 'e8:13:6e:f6:9a:94',
      secure: true,
      signalStrength: 68,
      frequency: 5200,
    },
    {
      SSID: 'WBZXA',
      BSSID: 'f2:74:8d:8e:f4:b3',
      secure: true,
      signalStrength: 37,
      frequency: 2437,
    },
    {
      SSID: 'WBZXA',
      BSSID: 'f2:74:8d:8e:f4:ab',
      secure: true,
      signalStrength: 41,
      frequency: 2437,
    },
    {
      SSID: 'DIRECT-3mHL-L9310CDW_BRe722',
      BSSID: '12:5b:ad:c5:e7:22',
      secure: true,
      signalStrength: 33,
      frequency: 2462,
    },
    {
      SSID: 'shentongInter',
      BSSID: 'e8:13:6e:f6:9a:33',
      secure: true,
      signalStrength: 99,
      frequency: 5220,
    },
    {
      SSID: 'shentongWiFi',
      BSSID: 'e8:13:6e:f6:9a:34',
      secure: true,
      signalStrength: 99,
      frequency: 5220,
    },
    {
      SSID: 'shentongGuest',
      BSSID: 'e8:13:6e:f6:9a:35',
      secure: false,
      signalStrength: 99,
      frequency: 5220,
    },
    {
      SSID: 'shentongInter',
      BSSID: 'e8:13:6e:f6:9a:23',
      secure: true,
      signalStrength: 99,
      frequency: 2412,
    },
    {
      SSID: 'bangwoganhuoma',
      BSSID: '40:45:da:ea:b5:73',
      secure: true,
      signalStrength: 99,
      frequency: 2412,
    },
    {
      SSID: 'MAXHUB-660',
      BSSID: 'b4:ad:a3:a4:b2:27',
      secure: true,
      signalStrength: 99,
      frequency: 5280,
    },
    {
      SSID: 'wendegao',
      BSSID: '90:67:1c:75:8d:6d',
      secure: true,
      signalStrength: 22,
      frequency: 5745,
    },
    {
      SSID: 'shentongGuest',
      BSSID: '10:c1:72:0a:b6:15',
      secure: false,
      signalStrength: 35,
      frequency: 5240,
    },
    {
      SSID: 'shentongWiFi',
      BSSID: '10:c1:72:0a:b6:14',
      secure: true,
      signalStrength: 33,
      frequency: 5240,
    },
    {
      SSID: 'shentongInter',
      BSSID: '10:c1:72:0a:b6:13',
      secure: true,
      signalStrength: 33,
      frequency: 5240,
    },
    {
      SSID: 'shentong1',
      BSSID: '14:d8:64:fc:3a:49',
      secure: true,
      signalStrength: 70,
      frequency: 5180,
    },
    {
      SSID: 'shentongGuest',
      BSSID: '28:68:d2:10:50:f5',
      secure: false,
      signalStrength: 41,
      frequency: 5785,
    },
    {
      SSID: 'shentongWiFi',
      BSSID: '28:68:d2:10:50:f4',
      secure: true,
      signalStrength: 41,
      frequency: 5785,
    },
    {
      SSID: 'shentongInter',
      BSSID: '28:68:d2:10:50:f3',
      secure: true,
      signalStrength: 41,
      frequency: 5785,
    },
    {
      SSID: 'WBZXA',
      BSSID: 'f0:74:8d:ce:f4:ab',
      secure: true,
      signalStrength: 28,
      frequency: 5200,
    },
    {
      SSID: 'shentongWiFi',
      BSSID: '28:68:d2:10:50:e4',
      secure: true,
      signalStrength: 33,
      frequency: 2437,
    },
    {
      SSID: 'shentongInter',
      BSSID: '28:68:d2:10:50:e3',
      secure: true,
      signalStrength: 33,
      frequency: 2437,
    },
    {
      SSID: 'shentongGuest',
      BSSID: '28:68:d2:10:50:e5',
      secure: false,
      signalStrength: 35,
      frequency: 2437,
    },
    {
      SSID: 'shentong1',
      BSSID: '14:d8:64:fc:3a:47',
      secure: true,
      signalStrength: 99,
      frequency: 2462,
    },
  ]

  const ab2hex = (buffer) => {
    let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    })
    return hexArr.join('')
  }

  const hexStringToAscii = (hexStr) => {
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
  }
  // uni.startWifi({
  //   success: function () {
  //     // Wi-Fi 模块初始化成功
  //     console.log('Wi-Fi 模块已初始化')
  //     // 在这里可以调用 wx.getWifiList
  //     uni.getWifiList({
  //       success: (result) => {
  //         console.log(JSON.stringify(result))
  //         uni.onGetWifiList((res) => {
  //           console.log(JSON.stringify(res))
  //           wifiList.value = res.wifiList
  //         })
  //       },
  //       fail: (error) => {
  //         console.error(JSON.stringify(error))
  //       },
  //     })
  //   },
  //   fail: function (err) {
  //     // 初始化失败
  //     console.error('Wi-Fi 初始化失败:', err)
  //   },
  // })
})

const handleSelectWifi = (e) => {
  wifiName.value = e.currentTarget.dataset.wifiname
}

const addDevice = (e) => {
  console.log(deviceId.value, deviceName.value)
  uni.showToast({
    title: '正在连接wifi中',
    mask: true,
    icon: 'loading',
    duration: 5000,
  })
  sendMsg(wifiName.value + ';' + wifiPass.value)
}

// 正式连接wifi
const sendMsg = (e) => {
  uni.getBLEDeviceCharacteristics({
    deviceId: deviceId.value,
    serviceId: deviceUUid.value,
    success: (res) => {
      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i]
        if (item.properties.write) {
          // 该特征值可写
          // 本示例是向蓝牙设备发送一个 0x00 的 16 进制数据
          // 实际使用时，应根据具体设备协议发送数据
          // const data = new Uint8Array([0x6c, 0x69, 0x67, 0x68, 0x74, 0x31, 0x6f, 0x6e]); // 假设这是"light1on"的UTF-8编码的16进制表示
          // const buffer = wx.base64.arrayBufferToBase64(data.buffer); // 转换为base64，因为微信小程序API可能需要base64格式
          console.log(e)
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
            deviceId: deviceId.value,
            serviceId: deviceUUid.value,
            characteristicId: item.uuid,
            value: buffer,
          })
        }
        if (item.properties.read) {
          // 改特征值可读
          uni.readBLECharacteristicValue({
            deviceId: deviceId.value,
            serviceId: deviceUUid.value,
            characteristicId: item.uuid,
          })
        }
        if (item.properties.notify || item.properties.indicate) {
          // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
          uni.notifyBLECharacteristicValueChange({
            deviceId: deviceId.value,
            serviceId: deviceUUid.value,
            characteristicId: item.uuid,
            state: true,
          })
          uni.onBLECharacteristicValueChange(function (res) {
            var asciiChar = hexStringToAscii(ab2hex(res.value))
            console.log('------------')
            console.log(asciiChar)
            if (asciiChar === 'WiFiconnected') {
              uni.showToast({
                title: '单片机wifi连接成功',
                duration: 1000,

                success() {
                  uni.navigateBack()
                },
              })
            } else {
              uni.showToast({
                title: '单片机wifi连接失败,请稍后再试',
                duration: 1000,
                icon: 'error',
              })
            }
          })
        }
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.container {
  /* 设置容器宽度为100%，以填充整个屏幕 */
  width: 100%;
  /* 设置容器高度为100%，以填充整个屏幕 */
  height: 100vh;
  overflow: auto;
  /* 设置背景图片 */
  background-image: url('../../static/images/bg/search-bg.jpg');
  /* 不重复背景图片 */
  background-repeat: repeat;
  /* 确保图片铺满整个容器 */
  background-size: cover;
  .content {
    /* 如果需要的话，可以设置内容区域的高度 */
    height: calc(100% - var(--status-bar-height));
  }
}
</style>
