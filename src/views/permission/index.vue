<!--  -->
<template>
  <div class="app-container">
    <div class="app-container-header">
      <el-button
        v-loading="loading"
        type="primary"
        @click="fetchList"
      >刷新</el-button>
    </div>
    <h2>
      权限树
    </h2>
    <el-tree
      v-loading="loading"
      :data="list"
      lazy
      :load="loadModule"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <div slot-scope="{ node }" class="custom-tree-node">
        <span>
          {{ node.data.name }}
        </span>
        <span class="tree-btn-container">
          <el-button
            v-if="node.data.myType === 'group'"
            type="text"
            size="mini"
            @click="() => addModule(node.data)"
          >
            添加新模块
          </el-button>
          <el-button
            v-if="node.data.myType === 'group'"
            type="text"
            size="mini"
            @click="() => addPermission(node.data)"
          >
            添加新权限
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => editNode(node.data)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => deletePermission(node.data)"
          >
            {{ node.data.status === 1 ? '禁用' : '启用' }}
          </el-button>
        </span>
      </div>
    </el-tree>
    <el-dialog
      v-loading="submiting"
      title="新增/编辑权限点"
      :visible.sync="dialogPointFormVisible"
      :close-on-click-modal="false"
      @closed="resetForm('pointForm')"
    >
      <el-form
        ref="pointForm"
        :model="pointForm"
        :rules="pointRules"
      >
        <el-form-item label="id" prop="id" hidden>
          <el-input v-model="pointForm.id" />
        </el-form-item>
        <el-form-item label="aclModuleKeyid" prop="aclModuleKeyid" hidden>
          <el-input v-model="pointForm.aclModuleKeyid" />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="pointForm.name" />
        </el-form-item>
        <el-form-item label="权限路径" prop="url" required>
          <el-input v-model="pointForm.url" />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-radio-group v-model="pointForm.type">
            <el-radio
              v-for="item in typeOptions"
              :key="item[0]"
              :label="item[0]"
            >
              {{ item[1] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顺序" prop="seq">
          <el-input-number v-model="pointForm.seq" :min="0" />
        </el-form-item>
        <el-form-item label="权限说明" prop="remark">
          <el-input v-model="pointForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPointFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrEditPoint">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="submiting"
      title="新增/编辑权限模块"
      :visible.sync="dialogModuleFormVisible"
      :close-on-click-modal="false"
      @closed="resetForm('moduleForm')"
    >
      <el-form
        ref="moduleForm"
        :model="moduleForm"
        :rules="moduleRules"
      >
        <el-form-item label="id" prop="id" hidden>
          <el-input v-model="moduleForm.id" />
        </el-form-item>
        <el-form-item label="parentId" prop="parentId" hidden>
          <el-input v-model="moduleForm.parentId" />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="moduleForm.name" />
        </el-form-item>
        <el-form-item label="顺序" prop="seq">
          <el-input-number v-model="pointForm.seq" :min="0" />
        </el-form-item>
        <el-form-item label="权限说明" prop="remark">
          <el-input v-model="pointForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModuleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrEditModule">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSysAclModuletree, getPageByAclmodulekeyid, updateACL, saveACL, saveSysAclModule, updateSysAclModule, deletesysAclModule } from '@/api'
import { mergeModuleAndPermission, mergePermissionToModule } from '@/utils'

export default {
  components: {},
  data() {
    return {
      list: [],
      loading: false,
      dialogPointFormVisible: false,
      dialogModuleFormVisible: false,
      isEdit: false,
      submiting: false,
      pointForm: {
        id: '',
        aclModuleKeyid: '',
        name: '',
        url: '',
        remark: '',
        // 1 菜单, 2 按钮, 3.其他
        type: 1,
        status: 1,
        seq: 0
      },
      pointRules: {
        name: [
          {
            required: true,
            message: '请输入权限名称',
            trigger: 'blur'
          }
        ],
        url: [
          {
            required: true,
            message: '请输入权限路径',
            trigger: 'blur'
          }
        ]
      },
      typeOptions: [
        [1, '菜单'],
        [2, '按钮'],
        [3, '其他']
      ],
      moduleForm: {
        id: '',
        parentId: '',
        name: '',
        remark: '',
        seq: 0,
        status: 1
      },
      moduleRules: {
        name: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      getSysAclModuletree().then(response => {
        const list = response.data
        mergeModuleAndPermission(list)
        this.list = list
      }).finally(_ => {
        this.loading = false
      })
    },
    addModule(node) {
      this.isEdit = false
      this.moduleForm.parentId = node.id
      this.dialogModuleFormVisible = true
      console.log('===> 在改节点下添加模块', node)
    },
    addPermission(node) {
      this.isEdit = false
      this.dialogPointFormVisible = true
      this.pointForm.aclModuleKeyid = node.id
      console.log('===> 在改节点下添加权限', node)
    },
    deletePermission(node) {
      console.log('===> 删除改节点', node)
      this.loading = true
      if (node.myType === 'group') {
        deletesysAclModule({
          aclModuleKeyid: node.id
        }).then(() => {
          this.$message.success('删除成功')
          this.fetchList()
        }).finally(_ => {
          this.loading = false
        })
      } else {
        updateACL({
          ...node,
          status: 0
        }).then(() => {
          this.$message.success('删除成功')
          this.fetchList()
        }).finally(_ => {
          this.loading = false
        })
      }
    },
    editNode(node) {
      console.log('===> 编辑改节点', node)
      this.isEdit = true
      if (node.myType === 'point') {
        this.pointForm = {
          ...node
        }
        this.dialogPointFormVisible = true
      } else {
        this.moduleForm = {
          ...node
        }
        this.dialogModuleFormVisible = true
      }
    },
    loadModule(node, resolve) {
      if (node.data.isLeaf || node.data.level === 0 || !node.data.id) {
        // FIXME: 很奇怪
        console.log('==> 声明了叶子节点了, ', node)
        resolve([])
        return
      }
      getPageByAclmodulekeyid({
        aclModuleKeyid: node.data.id
      }).then(response => {
        // 权限点
        const list = response.data.data || []
        const result = mergePermissionToModule(node.data, list)
        resolve(result)
      })
    },
    resetForm(formName) {
      console.log('==> resetForm', formName)
      this.$refs[formName].resetFields()
      // 重新没啥用, 奇怪
      this.pointForm = {
        id: '',
        aclModuleKeyid: '',
        name: '',
        url: '',
        remark: '',
        type: 1,
        status: 1,
        seq: 0
      }

      this.moduleForm = {
        id: '',
        parentId: '',
        name: '',
        remark: '',
        seq: 0,
        status: 1
      }
    },
    createOrEditPoint() {
      this.$refs['pointForm'].validate((valid) => {
        if (valid) {
          console.log('===> 权限点表单验证通过', this.pointForm)
          this.submiting = true
          const api = this.isEdit ? updateACL : saveACL
          api({
            ...this.pointForm
          }).then(response => {
            this.fetchList()
          }).finally(_ => {
            this.submiting = false
            this.dialogPointFormVisible = false
          })
        } else {
          console.log('===> 权限点表单验证失败')
        }
      })
    },
    createOrEditModule() {
      this.$refs['moduleForm'].validate((valid) => {
        if (valid) {
          console.log('===> 模块表单验证通过', this.moduleForm)
          this.submiting = true
          const api = this.isEdit ? updateSysAclModule : saveSysAclModule
          api({
            ...this.moduleForm
          }).then(response => {
            this.fetchList()
          }).finally(_ => {
            this.submiting = false
            this.dialogModuleFormVisible = false
          })
        } else {
          console.log('===> 模块表单验证失败')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.custom-tree-node {
  display: flex;
  align-items: center;

  .tree-btn-containe {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
