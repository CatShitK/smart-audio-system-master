<template>
  <view>
    <wd-form ref="form" :model="model">
      <wd-cell-group border>
        <wd-input
          label="设备名称"
          label-width="100px"
          prop="name"
          clearable
          v-model="model.name"
          placeholder="请输入设备名称"
          :rules="[{ required: true, message: '请输入设备名称' }]"
        />
        <wd-input
          label="备注"
          label-width="100px"
          prop="remark"
          clearable
          v-model="model.remark"
          placeholder="请输入备注"
        />
      </wd-cell-group>
      <view class="mt-4">
        <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
      </view>
    </wd-form>
  </view>
</template>

<script lang="ts" setup>
import { userDevicesCreateAPI } from '@/service/index/devices'
const emit = defineEmits(['onSubmitSuccess', 'onSubmitError'])
const model = reactive<{
  name: string
  remark: string
}>({
  name: '',
  remark: '',
})

const form = ref()

function handleSubmit() {
  console.log('结果值：', JSON.stringify(form.value))
  form.value
    .validate()
    .then(async ({ valid, errors }) => {
      if (valid) {
        await userDevicesCreateAPI({
          deviceCode: '12',
          deviceName: model.name,
          remark: model.remark,
        })
        console.log('校验通过')
        await emit('onSubmitSuccess')
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>

<style lang="scss" scoped></style>
