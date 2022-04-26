interface ACModules {
  myType: 'group'
  level: number
  id: string
  parentId: string
  aclModuleList: ACModules[]
  aclList: ACPoint[]
  children: (ACModules | ACPoint)[]
}

interface ACPoint {
  myType: 'point'
  id: string
  name: string
  code: string
  aclModuleKeyid: string
  url: string
  remark: string
}