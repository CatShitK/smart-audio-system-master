import { http } from '@/utils/http'

export interface IUserDevicesPage {
  current: number
  size: number
}

export interface IUserDevicesCreate {
  deviceName: string
  deviceCode: string
  remark?: string
}

export interface IUserDevicesDelete {
  id: number
}

/** GET 请求 */
export const getUserInfoAPI = () => {
  return http.get<any>('/user/info')
}

/**
 * 分页获取设备列表
 */
export const userDevicesPageAPI = (data: IUserDevicesPage) => {
  return http.post('/userdevices/page', data)
}

/**
 * 添加设备
 */
export const userDevicesCreateAPI = (data: IUserDevicesCreate) => {
  return http.post('/userdevices/create', data)
}

/**
 * 删除设备
 */
export const userDevicesDeleteAPI = (data: IUserDevicesDelete) => {
  return http.post('/userdevices/delete', data)
}
