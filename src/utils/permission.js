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
