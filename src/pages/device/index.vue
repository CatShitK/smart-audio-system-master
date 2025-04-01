<route lang="json5">
{
  style: {
    navigationBarTitleText: '设备列表',
  },
}
</route>
<template>
  <view class="p4">
    <view v-for="item in devicesList" :key="item.id">
      <Item @deleteSuccess="handleDelete" :deviceInfo="item"></Item>
    </view>

    <view class="mt-4 center bg-red pt-4 pb-4" @click="toCreate">添加新设备</view>
  </view>

  <wd-popup
    v-model="show"
    position="bottom"
    custom-style="padding: 40rpx;padding-bottom:200rpx"
    @close="handleClose"
  >
    <Create @onSubmitSuccess="createSucess"></Create>
  </wd-popup>
</template>

<script setup lang="ts">
import Item from '@/pages/device/components/item.vue'
import Create from '@/pages/device/components/create.vue'
import { onLoad } from '@dcloudio/uni-app'
import { userDevicesPageAPI } from '@/service/index/devices'

const show = ref(false)

const queryData = {
  current: 1,
  size: 10,
}

const handleClose = () => {}
const devicesList = ref([])
onLoad(async () => {
  await myDevicePage()
})
const createSucess = () => {
  console.log('创建成功')
  show.value = false
}
const handleDelet = async () => {
  await myDevicePage()
}

//请求我绑定过的设备列表
const myDevicePage = async () => {
  const res = await userDevicesPageAPI(queryData)
  devicesList.value = res.data.list
  console.log('请求列表返回：', JSON.stringify(res))
}

//添加新设备
const toCreate = () => {
  console.log('开始创建')
  show.value = true
}
</script>

<style scoped></style>
