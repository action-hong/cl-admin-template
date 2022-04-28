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

export const getDeptTree = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysDept/tree.corelink',
    params
  })
}

/**
 *
 * @param {{ id: string, name: string, parentId: string, seq: 0, remark: string }} data
 * @returns
 */
export const saveDept = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysDept/save.corelink',
    data
  })
}

/**
 *
 * @param {{ id: string, name: string, parentId: string, seq: 0, remark: string }} data
 * @returns
 */
export const updateDept = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysDept/update.corelink',
    data
  })
}

/**
 * @param {{ deptId: string }} data
 */
export const deleteDept = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysDept/delete.corelink',
    params
  })
  }
  

