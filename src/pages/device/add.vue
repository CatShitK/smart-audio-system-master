<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设备备注',
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
            <view class="text-center color-white font-700 font-size-4">添加设备</view>
          </wd-col>
          <wd-col :span="8"></wd-col>
        </wd-row>
      </view>
      <view class="color-white font-size-4 m-4">
        <view class="m-4">设备名称</view>
        <input
          v-model="wifiName"
          placeholder="请选择设备名称"
          placeholder-class="color-white"
          class="b-white b-1px b-solid p-2 m-2 rounded-2"
        />
      </view>
      <view class="color-white font-size-4 m-4">
        <view class="m-4">备注</view>
        <textarea
          placeholder-class="color-white"
          v-model="wifiName"
          class="b-white b-1px b-solid p-2 m-2 rounded-2"
          style="width: 90%"
          placeholder="请输入备注"
        />
      </view>
      <view class="mt-10 flex justify-center">
        <CommonButton text="提交" @onClick="addDevice"></CommonButton>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
const searchHeight = ref()
const statusBarHeight = ref()
const wifiName = ref()
const wifiPass = ref()

onReady(() => {
  console.log('onReady....')
  const height = uni.getSystemInfoSync().statusBarHeight
  console.log('height:', height)
  statusBarHeight.value = height // 状态栏高度
  const btnInfo = uni.getMenuButtonBoundingClientRect()
  searchHeight.value = btnInfo.height + (btnInfo.top - statusBarHeight.value) * 2 // 搜索框父元素高度
})
const wifiList = ref([])

onLoad(() => {
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
</script>

<style lang="scss" scoped>
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
  .content {
    /* 如果需要的话，可以设置内容区域的高度 */
    height: calc(100% - var(--status-bar-height));
  }
}
</style>
