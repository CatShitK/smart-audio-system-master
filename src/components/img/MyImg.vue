<template>
  <view>
    <image :style="props.style" :src="imgSrc" :mode="props.mode" @click="previewImage"></image>
  </view>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'
import { defineConfig, loadEnv } from 'vite'
const fileUrl = import.meta.env.VITE_APP_IMG_BASEURL

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  style: {
    type: Object,
  },
  mode: {
    type: String,
    default: '',
  },
  previewImage: {
    type: Boolean,
    default: false,
  },
})

const imgSrc = ref('')

onMounted(async () => {
  if (props.src) {
    // const request = await getFileAPI(props.imgName)
    // const base64Data = uni.arrayBufferToBase64(request.data);
    // authImgSrc.value = `data:image/png;base64,${base64Data}`;
    imgSrc.value = fileUrl + 'test/' + props.src
    console.log('加载的值')
    console.log(imgSrc.value)
  }
})
watch(
  () => props.src,
  async (newValue) => {
    if (props.src) {
      // const request = await getFileAPI(props.imgName)
      // const base64Data = uni.arrayBufferToBase64(request.data);
      // authImgSrc.value = `data:image/png;base64,${base64Data}`;
      // authImgSrc.value = `https://renduo.top/oss/shan-file/${props.imgName}`;
      imgSrc.value = fileUrl + 'test/' + props.src
      console.log(imgSrc.value)
    }
  },
)
</script>

<style lang="scss" scoped></style>
