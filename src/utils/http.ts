import { CustomRequestOptions } from '@/interceptors/request'
import { useUserStore } from '@/store'
export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      async success(res: any) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code === 401) {
            //重新获取新的token然后再次发送请求
            const newToken = await refreshAccessToken()
            // 更新请求header中的token
            if (!options.header) options.header = {}
            options.header.shantoken = newToken
            // 重新发起请求
            return http(options)
              .then((resData: IResData<T>) => resolve(resData))
              .catch((err: any) => reject(err))
          }
          if (res.data.code != 200) {
            uni.showToast({
              icon: 'none',
              title: res.data.msg,
            })
            reject(res)
          }
          resolve(res.data as IResData<T>)
        } else if (res.statusCode === 401) {
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: (res.data as IResData<T>).msg || '请求错误',
            })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

async function refreshAccessToken(): Promise<string> {
  // 这里是示例逻辑，实际中你需要替换为真实的API调用来获取新的Token
  try {
    let loginRes = await uni.login({
      provider: 'weixin',
    })
    const response = await uni.request({
      url: '/auth/mini-wx-login', // 你的刷新Token的API地址
      method: 'POST',
      data: {
        code: loginRes.code,
      },
      // 可能需要传递一些刷新Token所需的参数，例如refresh_token
    })
    if (response.statusCode === 200) {
      const resp: any = response.data
      if (resp.code != 200) {
        uni.showToast({
          title: '微信登录失败',
          icon: 'none',
        })
        throw new Error('Failed to refresh access token')
      }
      const newToken = resp.data // 假设返回的数据结构中包含token字段
      // 将新Token存储到本地存储中，例如uni.setStorageSync
      const userStore = useUserStore()
      userStore.userInfo.token = newToken
      return newToken
    } else {
      throw new Error('Failed to refresh access token')
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
    throw error
  }
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = <T>(url: string, query?: Record<string, any>) => {
  return http<T>({
    url,
    query,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
  })
}
/**
 * 上传文件
 * @param url 上传文件的后台地址
 * @param filePath 文件路径，可以通过 chooseImage 或其他方式获取
 * @param name 后端接收文件的字段名，默认为 'file'
 * @param formData 附加的表单数据，可选
 * @param header 自定义请求头，可选
 * @returns
 */
export const httpUpload = async <T>(
  url: string,
  filePath: string,
  name = 'file',
  formData?: Record<string, any>,
  header?: Record<string, string>,
) => {
  return new Promise<IResData<T>>((resolve, reject) => {
    // 检查并更新token，逻辑与http方法相同，这里简化处理，实际应用中应考虑是否在上传前刷新token
    // checkAndUpdateToken(header)
    // 请求基准地址
    const baseUrl = import.meta.env.VITE_SERVER_BASEURL
    url = baseUrl + url
    uni.uploadFile({
      url,
      filePath,
      name,
      formData: {
        ...(formData || {}),
        // 如果有token，确保添加到formData中
        ...(header?.shantoken && { shantoken: header.shantoken }),
      },
      header: {
        ...header,
        // 'content-type': 'multipart/form-data', // 这行通常不需要设置，因为uploadFile会自动处理
      },
      success: (uploadRes) => {
        const resData = JSON.parse(uploadRes.data)
        handleResponse(resData, resolve, reject)
      },
      fail: (err) => {
        uni.showToast({
          icon: 'none',
          title: '文件上传失败，请检查网络或重试',
        })
        reject(err)
      },
    })
  })
}
// 示例函数，用于模拟http中的token刷新逻辑，实际应用中应实现具体逻辑
const checkAndUpdateToken = (header?: Record<string, string>) => {
  // 这里可以根据需要调用refreshAccessToken并更新header
}
// 辅助函数，用于简化重复逻辑，模拟http中的响应处理
const handleResponse = <T>(
  resData: any,
  resolve: (value: IResData<T>) => void,
  reject: (reason?: any) => void,
) => {
  console.log('resData:', JSON.stringify(resData))
  if (resData.code === 401) {
    // 重新获取token并重试的逻辑可以在这里调用，但需注意避免循环调用
    reject(resData)
  } else if (resData.code === 200) {
    resolve(resData as IResData<T>)
  } else if (resData.statusCode >= 200 && resData.statusCode < 300) {
    resolve(resData as IResData<T>)
  } else {
    uni.showToast({
      icon: 'none',
      title: resData.msg || '请求错误',
    })
    reject(resData)
  }
}

http.get = httpGet
http.post = httpPost
http.upload = httpUpload
