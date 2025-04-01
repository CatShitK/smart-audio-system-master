<route lang="json5">
{
  style: {
    navigationBarTitleText: '设备详情',
  },
}
</route>
<template>
  <view class="p-4">
    <view class="text-size-lg">设备名称</view>
    <view class="mt-4">设备详情</view>
    <wd-cell-group>
      <wd-cell title="设备编码" value="sdfsdfsf" />
      <wd-cell title="设备" label="描述信息" />
    </wd-cell-group>

    <wd-button @click="show = true">编辑设备</wd-button>
  </view>
  <wd-popup
    v-model="show"
    position="bottom"
    custom-style="padding: 40rpx;padding-bottom:200rpx"
    @close="handleClose"
  >
    <Update @onSubmitSuccess="createSucess"></Update>
  </wd-popup>
</template>

<script setup lang="ts">
import Update from '@/pages/device/components/update.vue'
const show = ref(false)

const handleClose = () => {
  show.value = false
}
const createSucess = () => {
  show.value = false
}
</script>

<style lang="less" scoped></style>
