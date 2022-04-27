import request from '@/utils/request'

export const getSysAclModuletree = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysAclModule/tree.corelink',
    params
  })
}

// 新增
export const saveSysAclModule = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysAclModule/save.corelink',
    data
  })
}

// 更新
export const updateSysAclModule = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysAclModule/update.corelink',
    data
  })
}

/**
 *
 * @param {{ aclModuleKeyid: string }} params
 * @returns
 */
export const deletesysAclModule = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysAclModule/delete.corelink',
    params
  })
}

/**
 *
 * @param {{ aclModuleKeyid: string, pageNo?: number, pageSize?: number }} params
 * @returns
 */
export const getPageByAclmodulekeyid = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysAcl/get_page_by_aclmodulekeyid.corelink',
    params
  })
}

export const updateACL = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysAcl/update.corelink',
    data
  })
}

export const saveACL = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysAcl/save.corelink',
    data
  })
}

