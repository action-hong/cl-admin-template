import request from '@/utils/request'
import md5 from 'md5'
export function login(data) {
  return request({
    url: 'user/login.corelink',
    method: 'get',
    params: {
      ...data,
      password: md5(data.password).toUpperCase()
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/sysUser/get_userinfo.corelink',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout.corelink',
    method: 'get'
  })
}
