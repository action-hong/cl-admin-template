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

export const saveRole = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysRole/save.corelink',
    data
  })
}

export const updateRole = (data = {}) => {
  return request.request({
    method: 'POST',
    url: '/sysRole/update.corelink',
    data
  })
}

/**
 *
 * @param {{ roleId: string }} params
 * @returns
 */
export const getRoleTree = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysRole/tree.corelink',
    params
  })
}

/**
 *
 * @param {{ userIds: string[], roleId: string  }} params
 * @returns
 */
export const changeRoleUsers = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysRole/changeUsers.corelink',
    params
  })
}

/**
 *
 * @param {{ aclIds: string[], roleId: string  }} params
 * @returns
 */
export const changeRoleAcls = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysRole/changeAcls.corelink',
    params
  })
}

export const getRolelist = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysRole/list.corelink',
    params
  })
}

/**
 *
 * @param {{ roleId: string }} params
 * @returns
 */
export const getRoleUsers = (params = {}) => {
  return request.request({
    method: 'GET',
    url: '/sysRole/users.corelink',
    params
  })
}

