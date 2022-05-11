import Vue from 'vue'

// 这个应该动态生成
interface CL_PERMISSION {
  PERMISSION_CODE_ADD_DEPT: string
  PERMISSION_CODE_REMOVE_DEPT: string
  PERMISSION_CODE_EDIT_DEPT: string
  
  PERMISSION_DEPT: string[]
  
  // 后台用户
  PERMISSION_CODE_ADD_SYSTEM_USER: string
  PERMISSION_CODE_EDIT_SYSTEM_USER: string
  PERMISSION_CODE_RESET_SYSTEM_USER: string
  
  PERMISSION_SYSTEM_USER: string[]
}

declare module 'vue/types/vue' {
  interface Vue {
    $age: number;
    $clPermission: CL_PERMISSION
  }
}