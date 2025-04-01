import { http } from '@/utils/http'

//文件上传
export const uploadAPI = (data: any) => {
  return http.upload<any>('/file/upload', data)
}
