<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
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
            <view class="text-center color-white font-700 font-size-4">账号信息</view>
          </wd-col>
          <wd-col :span="8"></wd-col>
        </wd-row>
      </view>
      <view class="p-3">
        <view class="flex items-center justify-between p-1">
          <view class="color-white">
            <view>张三</view>
            <view>sdf</view>
          </view>
          <view class="w-20 h-20 bg-white rounded-full">
            <image class="w-20 h-20" src="../../static/images/user/userAvater.png"></image>
          </view>
        </view>
        <view
          class="mt-10 flex items-center justify-between b-rd-2 p-l-3 p-t-2 p-b-2 p-r-3"
          style="background: rgba(255, 255, 255, 0.7)"
        >
          <view>
            <view class="font-size-4 font-700 color-[#475F80]">我的设备/收集</view>
            <view class="m-t-2 color-[#4C4C4C] font-size-3">现有设备</view>
          </view>
          <view class="flex">
            <view
              class="font-size-4 font-700 color-[#475F80] font-size-9"
              style="color: rgba(139, 197, 232, 0.7)"
            >
              0
            </view>
            <view class="m-t-2 color-[#475F80] font-size-3 m-l-2 flex flex-items-end flex-row">
              台
            </view>
          </view>
        </view>
        <view
          class="mt-4 flex items-center justify-between b-rd-2 p-l-3 p-t-2 p-b-2 p-r-3"
          style="background: rgba(255, 255, 255, 0.7)"
        >
          <view>
            <view class="font-size-4 font-700 color-[#475F80]">报警设置</view>
            <view class="m-t-2 color-[#4C4C4C] font-size-3">现有设备</view>
          </view>
          <view class="flex flex-items-center">
            <wd-switch
              v-model="checked"
              active-color="#8AC5E7"
              inactive-color="#D18DBB"
              inactive-value="商家后台"
            />
          </view>
        </view>
        <view
          class="mt-4 flex items-center justify-between b-rd-2 p-l-3 p-t-2 p-b-2 p-r-3"
          style="background: rgba(255, 255, 255, 0.7)"
        >
          <view>
            <view class="font-size-4 font-700 color-[#475F80]">报警设置</view>
            <view class="m-t-2 color-[#4C4C4C] font-size-3">现有设备</view>
          </view>
          <view class="flex flex-items-center">
            <wd-switch
              v-model="checked"
              active-color="#8AC5E7"
              inactive-color="#D18DBB"
              inactive-value="商家后台"
            />
          </view>
        </view>
      </view>

      <view class="flex items-center justify-center">
        <view
          class="m-t-40 w-90 bg-[#FFFFFF] h-40 text-center"
          style="border-top-left-radius: 320rpx; border-top-right-radius: 320rpx"
          @click="toShop"
        >
          <view class="m-t-6 color-[#8BC5E8] font-size-4 font-700">DREAMSONIC</view>
          <view class="color-[#8BC5E8] font-size-8 font-700 tracking-4 text-center">BOX</view>
          <view class="m-t-4 color-[#475F80] text-center font-size-4">直达商城购买</view>
          <view class="m-t-1 color-[#8BC5E8] font-700 font-size-6">去看看></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const searchHeight = ref()
const statusBarHeight = ref()
const checked = ref(true)

onReady(() => {
  console.log('onReady....')
  const height = uni.getSystemInfoSync().statusBarHeight
  console.log('height:', height)
  statusBarHeight.value = height // 状态栏高度
  const btnInfo = uni.getMenuButtonBoundingClientRect()
  searchHeight.value = btnInfo.height + (btnInfo.top - statusBarHeight.value) * 2 // 搜索框父元素高度
})
const toShop = () => {
  // uni.navigateTo({
  //   url: '/pages/shop/index',
  // })
  uni.showToast({
    title: '正在建设中。。。',
    icon: 'none',
  })
}

const handleBack = () => {
  uni.navigateBack()
}

const toWifi = () => {
  uni.navigateTo({
    url: '/pages/wifi/index',
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
  background-image: url('../../static/images/bg/my-bg.jpg');
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
