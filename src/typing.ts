interface ACModules {
  level: number
  id: string
  parentId: string
  aclModuleList: ACModules[]
  aclList: ACPoint[]
}

interface ACPoint {
  id: string
  name: string
  code: string
  aclModuleKeyid: string
  url: string
  remark: string
}