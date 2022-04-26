import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
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
    list.forEach(item => {
      item.aclList.forEach(acl => {
        res.push(acl.url)
      })
      flapPermissions(item.aclModuleList, res)
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
  list.forEach(item => {
    item.myType = 'point'
    item.isLeaf = true
    module.children.push(item)
  })
  return [
    ...module.aclModuleList,
    ...list
  ]
}
