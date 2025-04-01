import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoAPI } from '@/service/index/user'

const initState = { nickname: '', avatar: '' }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!userInfo.value.token)

    const getUserInfo = async () => {
      const res = await getUserInfoAPI()
      const { nickName, avatar } = res.data
      userInfo.value.nickname = nickName
      userInfo.value.avatar = avatar
    }

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      reset,
      getUserInfo,
    }
  },
  {
    persist: true,
  },
)
