<template>
  <view class="text-circle" @click="toClick">
    <view class="w-10 text-center text-color-white font-700">{{ props.text }}</view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  ///标题
  text: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['onClick'])
const toClick = () => {
  emit('onClick')
}
</script>

<style lang="scss" scoped>
.text-circle {
  position: relative; /* 设置相对定位，用于伪元素定位 */
  display: flex;
  align-items: center; /* 垂直居中，可选 */
  justify-content: center; /* 水平居中 */
  width: 200rpx; /* 宽度 */
  height: 200rpx; /* 高度 */
  // padding: 10rpx; /* 根据需要调整内边距 */
  border-radius: 50%; /* 圆形化容器 */
}

.text-circle::before,
.text-circle::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  content: ''; /* 必须要有content属性 */
  border-radius: inherit;
}

.text-circle::before {
  z-index: 1;
  border: 2rpx solid #d8d8d8;
}

.text-circle::after {
  z-index: 2;
  margin: 8rpx; /* 与内层边框的间距 */
  border: 2rpx solid #ffffff;
}
/* 第三个圆圈边框，可以使用box-shadow来实现 */
.text-circle {
  box-shadow: 0 0 0 2rpx #d8d8d8 inset;
}
</style>
