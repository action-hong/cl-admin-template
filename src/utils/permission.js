import store from '@/store'

/**
 * @param {Array | string} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some((role) => {
      if (Array.isArray(permissionRoles)) {
        return permissionRoles.includes(role)
      }
      return role === permissionRoles
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

/**
 *
 * @param {ACModules[]} list
 * @param {string[]} res
 */
export function flapPermissions(list, res = []) {
  if (list && list.length > 0) {
    list.forEach((item) => {
      item.aclList.forEach((acl) => {
        res.push(acl.code)
      })
      flapPermissions(item.aclModuleList, res)
    })
  }
  return res
}

export function flapPermissionsWith(list, res = []) {
  if (list && list.length > 0) {
    list.forEach((item) => {
      item.aclList.forEach((acl) => {
        res.push({
          name: acl.name,
          code: acl.code
        })
      })
      flapPermissionsWith(item.aclModuleList, res)
    })
  }
  return res
}

/**
 *
 * @param {ACModules[]} list
 */
export function mergeModuleAndPermission(list) {
  for (let i = 0; i < list.length; i++) {
    const module = list[i]
    module.children = []
    module.myType = 'group'
    module.isLeaf = false

    mergeModuleAndPermission(module.aclModuleList)
    // for (let j = 0; j < module.aclModuleList.length; j++) {
    // const subModule = module.aclModuleList[j]
    // module.children.push(subModule)
    // }
  }
}

/**
 *
 * @param {ACModules} module
 * @param {ACPoint[]} list
 */
export function mergePermissionToModule(module, list) {
  list.forEach((item) => {
    item.myType = 'point'
    item.isLeaf = true
    module.children.push(item)
  })
  return [...module.aclModuleList, ...list]
}

/**
 *
 * @param {ACModules[]} list
 */
export function resolveACLModule(list, classify = []) {
  list.forEach((item) => {
    item.classify = classify
    item.children = item.aclModuleList
    resolveACLModule(item.aclModuleList, [...classify, item.id])
    delete item.aclModuleList
  })
  return list
}

/**
 *
 * @param {ACModules[]} list
 */
export function resolveModuleForTree(list) {
  for (let i = 0; i < list.length; i++) {
    const module = list[i]
    module.myType = 'group'

    resolveModuleForTree(module.aclModuleList)
    module.children = [...module.aclModuleList]
    for (let j = 0; j < module.aclList.length; j++) {
      const subModule = module.aclList[j]
      subModule.myType = 'point'
      module.children.push(subModule)
    }
  }
  return list
}

/**
 *
 * @param {ACModules[]} list
 */
export function getRoleAcl(list, res = []) {
  list.forEach(item => {
    getRoleAcl(item.aclModuleList, res)
    item.aclList.forEach(acl => {
      if (acl.checked) {
        res.push(acl.id)
      }
    })
  })
  return res
}

/**
 *
 * @param {ACModules} item
 */
export function getAllAcl(item, res = []) {
  item.aclList.forEach(acl => {
    res.push(acl.id)
  })
  if (item.aclModuleList.length > 0) {
    item.aclModuleList.forEach(module => {
      getAllAcl(module, res)
    })
  }
  return res
}

export function resolveDept(list, classify = []) {
  list.forEach((item) => {
    item.classify = classify
    resolveDept(item.deptList, [...classify, item.id])
  })
  return list
}
