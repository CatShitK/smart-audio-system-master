<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '搜索设备',
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
            <view class="text-center color-white font-700 font-size-4">搜索设备</view>
          </wd-col>
          <wd-col :span="8"></wd-col>
        </wd-row>
      </view>

      <view class="m-4 b-white b-1px b-solid p-2">搜索</view>

      <!-- <view v-for="(item, index) in blueDeviceData" :key="index">
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
      </view> -->
      <view class="devices-list">
        <view
          class="device-item"
          v-for="(item, index) in state.deviceList"
          :key="index"
          :data-item="item"
          @click="connectBlueTooth(item)"
        >
          <view>
            <image
              style="width: 200rpx; height: 200rpx"
              src="../../static/devices/devices.png"
            ></image>
            <view class="font-size-4 color-white font-700">型号-{{ item.localName }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <wd-popup
    v-model="showWifi"
    custom-style="height: 240px; border-radius:32rpx; "
    @close="handleClose"
  >
    <view class="p-2" style="width: 650rpx">
      <view class="m-2 text-cyan">输入wifi密码</view>
      <view class="m-2">
        <wd-input
          label="wifi名称"
          label-width="100px"
          prop="value1"
          v-model="wifiModel.value1"
          :disabled="true"
          placeholder="请输入用户名"
        />
        <wd-input
          label="密码"
          label-width="100px"
          prop="value2"
          clearable
          v-model="wifiModel.value2"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </view>
      <view class="m-4">
        <wd-button type="primary" size="large" @click="sendData()" block>提交</wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
const searchHeight = ref()
const statusBarHeight = ref()
const blueDeviceData = ref([])
const isWifiValue = ref()
const wifiUsername = ref()
const wifiPassword = ref()
const connected = ref(false)
const deviceName = ref('')
const deviceId = ref()
const deviceUUid = ref()
const showWifi = ref(false)
const wifiModel = ref({})

//当前wifi名称
const currentWifi = ref({})

const state = reactive<any>({
  nDelayTimer: -1, //定时器
  isFind: false, //是否发现设备
  deviceList: [], //设备列表

  //特征值
  currentDeviceId: undefined,
  currentServiceId: undefined,
  currentCharId: undefined,

  dataList: [],
})

const handleClose = () => {
  showWifi.value = false
}

onReady(() => {
  console.log('onReady....')
  const height = uni.getSystemInfoSync().statusBarHeight
  console.log('height:', height)
  statusBarHeight.value = height // 状态栏高度
  const btnInfo = uni.getMenuButtonBoundingClientRect()
  searchHeight.value = btnInfo.height + (btnInfo.top - statusBarHeight.value) * 2 // 搜索框父元素高度
})

onMounted(() => {
  getWifi()
  initBlueTooth()
})

const initBlueTooth = () => {
  console.log('初始化蓝牙适配器')
  uni.openBluetoothAdapter({
    success: (res) => {
      console.log(res)
      findBlueTooth()
    },
    fail: (res) => {
      console.log(res)
      uni.showToast({
        title: '请先打开蓝牙',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

//查询当前连接wifi
const getWifi = () => {
  uni.startWifi({
    success: (res) => {
      uni.getConnectedWifi({
        success: (result) => {
          console.log(result)
          currentWifi.value = result.wifi
          wifiModel.value.value1 = result.wifi.SSID
        },
        fail: (result) => {
          console.log(result)
          if (result.errCode === 12006) {
            uni.showModal({
              title: '请打开GPS定位',
              content: 'Android手机不打开GPS定位，无法搜索到蓝牙设备',
              showCancel: false,
            })
          } else {
            uni.showToast({
              title: `${result.errCode}`,
              icon: 'none',
              duration: 2000,
            })
          }
        },
      })
    },
  })
}

const findBlueTooth = () => {
  uni.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: false,
    interval: 0,
    success: (res) => {
      console.log(res)
      uni.showLoading({
        title: '正在搜索设备',
      })
      const nTimer = setInterval(() => discoveryBlueTooth(), 1000)
      state.nDelayTimer = nTimer
      setTimeout(() => {
        uni.hideLoading()
        if (state.isFind) {
          return
        }
        console.log('搜索设备超时')
        uni.stopBluetoothDevicesDiscovery({
          success: (result) => {
            console.log(result)
          },
        })
        clearInterval(state.nDelayTimer)
        uni.showModal({
          title: '搜索设备超时',
          content: '请检查蓝牙设备是否正常工作，Android手机请打开GPS定位',
          showCancel: false,
        })
      }, 5000)
    },
    fail: (res) => {
      console.log(res)
      uni.showToast({
        title: `蓝牙设备服务发现设备${res.errMsg}`,
        icon: 'none',
        duration: 2000,
      })
    },
  })
}
const stopBlueToothDevice = () => {
  uni.hideLoading()
  clearInterval(state.nDelayTimer)
}

const discoveryBlueTooth = () => {
  uni.getBluetoothDevices({
    success: (res) => {
      console.log(
        '🚀 ~ discoveryBlueTooth ~ res.devices.length:',
        JSON.stringify(res.devices.length),
      )
      if (res.devices.length > 0) {
        const list = res.devices
        const devices: any[] = []
        list.forEach((item) => {
          const name = item.localName || item.name
          if (name.startsWith('xhn_')) {
            devices.push(item)
          }

          // if (isNotEmptyObject(name) && name !== "" && name !== "未知设备") {
          // 	devices.push(item);
          // }
        })
        console.log('🚀 ~ discoveryBlueTooth ~ devices:', devices)

        state.deviceList = devices
        state.isFind = true
      }
    },
    fail: (res) => {
      console.log(res)
      uni.showToast({
        title: '搜索蓝牙设备失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

const initBluetoothAdapter = () => {
  console.log(`output->开始连接蓝牙`)
  uni.openBluetoothAdapter({
    success: function (res) {
      console.log(res)
      startDiscovery() // 初始化成功后开始扫描
    },
    fail: function (res) {
      console.log(`output->res`, res)
      startDiscovery()
    },
  })
}

const startDiscovery = () => {
  console.log('设备连接蓝牙')
  uni.startBluetoothDevicesDiscovery({
    success: function (res) {
      const map = new Map()
      console.log(res)
      function onDeviceFound(devices) {
        // 假设你已知ESP32的蓝牙名称，这里只是示例代码，你可能需要遍历devices数组来找到ESP32
        for (let i = 0; i < devices.devices.length; i++) {
          if (devices.devices[i].name.length > 0 && devices.devices[i].name != '') {
            console.log(devices.devices[i].name.length)
            blueDeviceData.value.push({
              deviceName: devices.devices[i].name,
              deviceId: devices.devices[i].deviceId,
              isSucess: false,
            })
          }
          // const newArr =blueDevice.filter(v => !map.has(v.deviceName) && map.set(v.deviceName, v));
          // 停止扫描并连接ESP32
          break
        }
      }
      uni.onBluetoothDeviceFound(onDeviceFound) // 监听找到新设备的事件
    },
    fail: function (res) {},
  })
}

function hexStringToAscii(hexStr) {
  let asciiStr = ''
  for (let i = 0; i < hexStr.length; i += 2) {
    const hexByte = hexStr.substr(i, 2)
    const decimalByte = parseInt(hexByte, 16)
    asciiStr += String.fromCharCode(decimalByte)
  }
  return asciiStr
}

// function ab2hex(buffer) {
//   const hexArr = Array.from(new Uint8Array(buffer), (bit) => ('00' + bit.toString(16)).slice(-2))
//   return hexArr.join('')
// }
function isWifiConnected() {
  if (isWifiValue.value === 'NoWificonnected') {
    uni.showToast({
      title: '此设备暂未连接wifi',
      icon: 'error',
      duration: 2000,
    })
  } else {
    uni.showToast({
      title: '单片机已经连接至wifi',
      icon: 'success',
      duration: 2000,
    })
  }
}
function handleWifiUsername(e) {
  wifiUsername.value = e.detail.value
}

const connectBlueTooth = (device: any) => {
  uni.showLoading({ title: '开始连接设备' })
  stopBlueToothDevice()
  closeBlueTooth(device, () => {
    setTimeout(() => {
      uni.createBLEConnection({
        deviceId: device?.deviceId,
        success: (res: any) => {
          uni.hideLoading()
          uni.showToast({
            title: '设备连接成功',
            icon: 'success',
            duration: 2000,
          })
          console.log(res)
          showWifi.value = true
          getBlueToothService(device?.deviceId)
        },
        fail: (res: any) => {
          uni.hideLoading()
          uni.showToast({
            title: `设备连接失败：${res.errMsg}`,
            icon: 'none',
            duration: 2000,
          })
          console.log(res)
        },
      })
    }, 2000)
  })
}

const closeBlueTooth = (device: any, callback: any) => {
  uni.closeBLEConnection({
    deviceId: device?.deviceId,
    success: (res: any) => {
      console.log(`断开蓝牙设备[${device?.deviceId}]成功`)
      console.log(res)
    },
    fail: (res: any) => {
      console.log(res)
    },
    complete: callback,
  })
}
//获取蓝牙设备服务uuid
const getBlueToothService = (deviceId: any) => {
  uni.getBLEDeviceServices({
    deviceId: deviceId,
    success: (res: any) => {
      console.log(res)
      const services = res.services
      if (services.length <= 0) {
        console.log('未找到主服务列表')
        return
      }
      console.log(`找到服务列表个数：${services.length}`)
      const service = services[0]
      console.log(`服务UUID：${service.uuid}`)
      getBlueToothCharacteristics(deviceId, service.uuid)
    },
    fail: (res: any) => {
      console.log(`获取服务列表失败：${res.errMsg}`)
    },
  })
}

//获取设备特征值
const getBlueToothCharacteristics = (deviceId: any, uuid: any) => {
  uni.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: uuid,
    success: (res: any) => {
      console.log(res)
      // 这里会获取到两个特征值，一个用来写，一个用来读
      const chars = res.characteristics
      if (chars.length <= 0) {
        console.log('未找到设备特征码')
        return
      }
      console.log(`找到设备特征码个数：${chars.length}`)
      if (chars.length >= 2) {
        chars.forEach((item: any) => {
          const prop = item.properties
          if (prop.notify === true) {
            receiveData(deviceId, uuid, item.uuid)
          } else if (prop.write === true) {
            // sendData(deviceId, uuid, item.uuid)
            state.currentDeviceId = deviceId
            state.currentServiceId = uuid
            state.currentCharId = item.uuid
          }
        })
      }
    },
    fail: (res) => {
      console.log(`获取设备特征码失败：${res.errMsg}`)
    },
  })
}
const ab2hex = (buffer: any) => {
  var hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit: any) {
    return ('00' + bit.toString(16)).slice(-2)
  })
  return hexArr.join('')
}

//接受蓝牙设备发送过来的数据
const receiveData = (deviceId: any, serviceId: any, charId: any) => {
  uni.notifyBLECharacteristicValueChange({
    deviceId: deviceId,
    serviceId: serviceId,
    characteristicId: charId,
    state: true,
    success: (res: any) => {
      console.log(res)
      uni.onBLECharacteristicValueChange((data: any) => {
        console.log(data)
        const value = ab2hex(data.value)
        console.log(`收到Notify数据：${value}`)
        let list: any[] = state.dataList
        list.push(value)
        state.dataList = list
      })
    },
    fail: (res: any) => {
      console.log(`特征值Notice 接收数据失败：${res.errMsg}`)
    },
  })
}

function submitPost() {
  uni.showToast({
    title: '正在连接wifi中',
    mask: true,
    icon: 'loading',
  })
}

function handleConnect(e) {
  const deviceId = e.target.dataset.blueid
  createBLEConnection(deviceId)
}

const sendData = () => {
  const str = wifiModel.value.value1 + ';' + wifiModel.value.value2
  const buffer = new ArrayBuffer(str.length)
  const dataView = new DataView(buffer)
  for (let i = 0; i < str.length; i++) {
    dataView.setUint8(i, str.charCodeAt(i))
  }
  console.log(buffer)
  setTimeout(() => {
    uni.writeBLECharacteristicValue({
      value: buffer,
      deviceId: state?.currentDeviceId,
      serviceId: state?.currentServiceId,
      characteristicId: state?.currentCharId,
      success: (res: any) => {
        console.log(res)
        console.log(`发送成功`)
      },
      fail: (res: any) => {
        console.log(`发送失败：${res.errMsg}`)
      },
    })
  }, 1000)
}

const handleSend = () => {
  uni.getBLEDeviceCharacteristics({
    deviceId: deviceId.value,
    serviceId: deviceUUid.value,
    success: (res) => {
      for (let i = 0; i < res.characteristics.length; i++) {
        let item = res.characteristics[i]
        if (item.properties.write === true) {
          console.log(res.characteristics[i], '崩溃')

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
          if (uni.getSystemInfoSync().platform === 'android') {
            uni.writeBLECharacteristicValue({
              deviceId: deviceId.value,
              serviceId: deviceUUid.value,
              characteristicId: item.uuid,
              value: buffer,
              success: (success) => {
                uni.notifyBLECharacteristicValueChange({
                  deviceId: deviceId.value,
                  serviceId: deviceUUid.value,
                  characteristicId: item.uuid,
                  state: true,
                })
                console.log(123)
                setTimeout(() => {
                  uni.onBLECharacteristicValueChange(function (res) {
                    var asciiChar = hexStringToAscii(ab2hex(res.value))
                    console.log(ab2hex(res.value))
                    console.log('卡片机是否有wifi链接：', asciiChar)
                    isWifiValue.value = asciiChar
                    console.log('44444444444')
                    isWifiConnected()
                  })
                }, 2000)

                console.log(321)
              },
              fail(err) {
                console.log('uni.writeBLECharacteristicValue', err)
              },
            })
          }
        }
      }
    },
    fail(err) {
      console.log(' uni.getBLEDeviceCharacteristics', err)
    },
  })
}
// if (uni.getSystemInfoSync().platform === 'ios') {
//             if (item.properties.read) {
//               uni.readBLECharacteristicValue({
//                 deviceId: deviceId.value,
//                 serviceId: deviceUUid.value,
//                 characteristicId: item.uuid,
//               })
//             }
//             if (item.properties.notify || item.properties.indicate) {
//               // 必须先启用 wx.notifyBLECharacteristicValueChange 才能监听到设备 onBLECharacteristicValueChange 事件
//               uni.notifyBLECharacteristicValueChange({
//                 deviceId: deviceId.value,
//                 serviceId: deviceUUid.value,
//                 characteristicId: item.uuid,
//                 state: true,
//               })
//               uni.onBLECharacteristicValueChange(function (res) {
//                 var asciiChar = hexStringToAscii(ab2hex(res.value))
//                 console.log('卡片机是否有wifi链接：', asciiChar)
//                 isWifiValue.value = asciiChar
//                 isWifiConnected()
//               })
//             }
//           }
const createBLEConnection = (e) => {
  uni.stopBluetoothDevicesDiscovery()

  uni.createBLEConnection({
    deviceId: deviceId.value,
    success: (res) => {
      uni.getBLEDeviceServices({
        deviceId: deviceId.value,
        // 搜索到设备的 deviceId
        success: (res) => {
          for (let i = 0; i < res.services.length; i++) {
            if (
              res.services[i].isPrimary &&
              res.services[i].uuid.split('-')[0] != '00001800' &&
              res.services[i].uuid.split('-')[0] != '00001801'
            ) {
              // 可根据具体业务需要，选择一个主服务进行通信
              deviceUUid.value = res.services[i].uuid

              handleSend()
            }
          }
        },
      })
      // this.getBLEDeviceServices(deviceId)
    },
    fail(err) {
      console.log('uni.createBLEConnection', err)
      uni.stopBluetoothDevicesDiscovery()
    },
  })
}

const handleBack = () => {
  uni.navigateBack()
}

const toWifi = (e) => {
  deviceId.value = e.currentTarget.dataset.item.deviceId
  deviceName.value = e.currentTarget.dataset.item.deviceName

  uni.showLoading({
    title: '连接蓝牙中',
  })
  createBLEConnection(e)
  uni.showToast({ title: '连接成功', icon: 'success', duration: 2000 })
  if (isWifiValue.value == 'NoWificonnected')
    uni.navigateTo({
      url: `/pages/wifi/index?deviceName=${e.currentTarget.dataset.item.deviceName}&deviceId=${e.currentTarget.dataset.item.deviceId}&deviceUUid=${deviceUUid.value}`,
    })
}
</script>

<style lang="scss">
.container {
  /* 设置容器宽度为100%，以填充整个屏幕 */
  width: 100%;
  /* 设置容器高度为100%，以填充整个屏幕 */
  height: 100vh;
  /* 设置背景图片 */
  background-image: url('../../static/images/bg/search-bg.jpg');
  /* 不重复背景图片 */
  background-repeat: repeat;
  /* 确保图片铺满整个容器 */
  background-size: cover;
}

.content {
  /* 如果需要的话，可以设置内容区域的高度 */
  height: calc(100% - var(--status-bar-height));
  /* 其他样式 */
  .devices-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // 两列布局
    // gap: 16rpx; // 列之间的间距

    .device-item {
      display: flex;
      align-items: center;
      justify-content: center;
      // 新增类，用于单个元素的样式
      padding: 100rpx; // 内边距
      background-color: rgba(255, 255, 255, 0.1); // 可选，如果需要背景颜色
      border: 1rpx solid #ffffff; // 白色边框
      box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1); // 可选，阴影效果
    }
  }
}
</style>
