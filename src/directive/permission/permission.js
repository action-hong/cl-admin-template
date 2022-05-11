import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles

  if (value) {
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      if (Array.isArray(permissionRoles)) {
        return permissionRoles.includes(role)
      }
      return permissionRoles === role
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`not found permission code with ${binding.value}`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
