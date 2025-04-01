<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '新首页',
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
        class="text-center color-white font-700 font-size-4"
      >
        DREAMSONIC BOX
      </view>

      <view class="mt-4 text-center text-color-white font-size-4 font-700 p-t-25">暂无设备</view>

      <view class="mt-60 flex justify-center">
        <CommonButton text="添加设备" @onClick="addDevice"></CommonButton>
      </view>
      <view class="mt-4 text-center text-color-white font-size-2 font-700">
        需要添加设备后才能使用
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const searchHeight = ref()
const statusBarHeight = ref()
onReady(() => {
  console.log('onReady....')
  const height = uni.getSystemInfoSync().statusBarHeight
  console.log('height:', height)
  statusBarHeight.value = height // 状态栏高度
  const btnInfo = uni.getMenuButtonBoundingClientRect()
  searchHeight.value = btnInfo.height + (btnInfo.top - statusBarHeight.value) * 2 // 搜索框父元素高度
})

const addDevice = () => {
  console.log('addDevice')
  uni.navigateTo({
    url: '/pages/search/index',
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
  background-image: url('../../static/images/bg/index-bg.jpg');
  /* 不重复背景图片 */
  background-repeat: repeat;
  /* 确保图片铺满整个容器 */
  background-size: cover;
}

.content {
  /* 如果需要的话，可以设置内容区域的高度 */
  height: calc(100% - var(--status-bar-height));
  /* 其他样式 */
}
</style>
