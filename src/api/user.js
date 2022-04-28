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

/**
 *
 * @param {{ deptKeyid: string, pageNo?: number, pageSize?: number }} params
 * @returns
 */
export const getPageByDeptkeyid = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysUser/get_page_by_deptkeyid.corelink',
    params
  })
}

/**
 *
 * @param {{  id: string, username: string,telephone: string,mail: string,deptId: string,status: 2,remark: string}} data
 * @returns
 */
export const saveUser = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysUser/save.corelink',
    data
  })
}

export const updateUser = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysUser/update.corelink',
    data
  })
}

/**
 *
 * @param {{ id: string }} params
 * @returns
 */
export const resetUserPassword = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysUser/resetPassword.corelink',
    params
  })
}

