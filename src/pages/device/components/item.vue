<template>
  <view
    class="flex border-rd-md bg-white mt-2 pt-5 pb-5 pl-4 pr-4 flex-justify-between flex-items-center"
  >
    <view class="flex flex-items-center" @click="toDetail">
      <view>
        <image src="/static/logo.svg" alt="" class="w-16 h-16 block mx-auto" />
      </view>
      <view class="ml-6.25 text-shadow-color-inherit">{{ props.deviceInfo.deviceName }}</view>
    </view>
    <view class="font-size-4" @click="toDelete">删除</view>
  </view>
  <wd-notify />
</template>

<script setup lang="ts">
import { userDevicesDeleteAPI } from '@/service/index/devices'
import { useNotify } from 'wot-design-uni'

const { showNotify, closeNotify } = useNotify()
const props = defineProps({
  deviceInfo: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['deleteSuccess'])

const toDelete = () => {
  console.log('开始删除')
  uni.showModal({
    title: '提示',
    content: '是否删除该设备？',
    success: async (res) => {
      if (res.confirm) {
        await userDevicesDeleteAPI({ id: props.deviceInfo.id })
        showNotify({ type: 'success', message: '删除成功' })
        emit('deleteSuccess')
      } else if (res.cancel) {
      }
    },
  })
}
const toDetail = () => {
  uni.navigateTo({
    url: `/pages/device/detail?id=${props.deviceInfo.id}`,
  })
}
</script>

<style lang="scss" scoped></style>
