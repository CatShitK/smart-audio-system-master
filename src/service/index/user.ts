import { http } from '@/utils/http'

export interface IUserUpdate {
  name: string
  avatar: string
}

/** GET 请求 */
export const getUserInfoAPI = () => {
  return http.get<any>('/user/info')
}

/**
 * 更新用户信息
 */
export const updateUserInfoAPI = (data: IUserUpdate) => {
  return http.post<IUserUpdate>('/user/update-info', data)
}
