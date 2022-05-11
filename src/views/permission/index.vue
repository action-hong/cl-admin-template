<!--  -->
<template>
  <el-container class="app-container">
    <el-header>
      <el-button
        v-loading="loading"
        type="primary"
        @click="fetchList"
      >刷新</el-button>
      <el-button
        v-loading="loading"
        type="primary"
        @click="handleCreateModule"
      >新增权限模块</el-button>
      <el-button
        v-loading="loading"
        type="primary"
        @click="handleCreateACL"
      >新增权限</el-button>
    </el-header>
    <el-container>
      <el-aside
        width="400px"
        style="background-color: #ffffff"
      >
        <el-table
          v-loading="loading"
          :data="moduleList"
          row-key="id"
          border
          default-expand-all
          highlight-current-row
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @current-change="handleModuleChange"
        >
          <el-table-column
            prop="name"
            label="模块名称"
          />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click.stop="handleModuleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-divider
                direction="vertical"
              />
              <el-popconfirm
                title="是否删除该权限模块?"
                @onConfirm="handleModuleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  type="danger"
                  @click.native.stop
                >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main>
        <p>
          {{ currentModule.name }} 的权限
        </p>
        <el-divider />
        <el-table
          v-loading="loadingACL"
          :data="aclList"
          row-key="id"
          empty-text="该模块暂时没有权限"
          border
        >
          <el-table-column
            prop="name"
            label="权限名称"
            width="120"
          />
          <el-table-column
            prop="url"
            label="权限路径"
          />
          <el-table-column
            prop="type"
            label="类型"
            width="80"
          >
            <template slot-scope="scope">
              <el-tag
                :type="['', 'success', 'warning'][scope.row.type] || ''"
              >
                {{ scope.row.type | permissionType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEditACL(scope.row)"
              >编辑</el-button>
              <el-divider
                direction="vertical"
              />
              <el-button
                size="mini"
                @click="handleChangeACLStatus(scope.row)"
              >{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-main>
    </el-container>
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
        <el-form-item
          prop="classify"
          label="上级模块"
        >
          <el-cascader
            v-model="moduleForm.classify"
            :props="{ checkStrictly: true }"
            :options="disableModuleOptions"
            placeholder="--"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="moduleForm.name" />
        </el-form-item>
        <el-form-item label="顺序" prop="seq">
          <el-input-number v-model="moduleForm.seq" :min="0" />
        </el-form-item>
        <el-form-item label="权限说明" prop="remark">
          <el-input v-model="moduleForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogModuleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrEditModule">确 定</el-button>
      </div>
    </el-dialog>
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
        <el-form-item
          prop="classify"
          label="上级模块"
        >
          <el-cascader
            v-model="pointForm.classify"
            :props="{ checkStrictly: true }"
            :options="moduleOptions"
            placeholder="--"
            clearable
          />
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
  </el-container>
</template>

<script>
import { getSysAclModuletree, updateSysAclModule, saveSysAclModule, getPageByAclmodulekeyid, updateACL, saveACL, deletesysAclModule } from '@/api'
import { resolveACLModule } from '@/utils'
export default {
  components: {},
  filters: {
    permissionType(type) {
      switch (type) {
        case 1:
          return '菜单'
        case 2:
          return '按钮'
        default:
          return '其他'
      }
    }
  },
  data() {
    return {
      moduleList: [],
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
        seq: 0,
        classify: []
      },
      pointRules: {
        name: [
          {
            required: true,
            message: '请输入权限名称'
          }
        ],
        url: [
          {
            required: true,
            message: '请输入权限路径'
          },
          {
            min: 6,
            max: 100,
            message: '长度在 6 到 100 个字符'
          }
        ],
        classify: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value && value.length > 0) {
                callback()
              } else {
                callback(new Error('请选择上级模块'))
              }
            }
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
        status: 1,
        // 级联
        classify: []
      },
      moduleRules: {
        name: [
          {
            required: true,
            message: '请输入模块名称'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符'
          }
        ]
      },
      pageSize: 10,
      totalSize: 0,
      currentPage: 1,
      // loading 权限
      loadingACL: false,
      aclList: [],
      // 当前选择的模块
      currentModule: {
        name: ''
      }
    }
  },
  computed: {
    disableModuleOptions() {
      const id = this.moduleForm.id
      function resolveModule(list) {
        return list.map(item => {
          return {
            value: item.id,
            label: item.name,
            disabled: item.id === id,
            children: item.children.length > 0 ? resolveModule(item.children) : []
          }
        })
      }
      return resolveModule(this.moduleList)
    },
    moduleOptions() {
      function resolveModule(list) {
        return list.map(item => {
          return {
            value: item.id,
            label: item.name,
            children: item.children.length > 0 ? resolveModule(item.children) : []
          }
        })
      }
      return resolveModule(this.moduleList)
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      getSysAclModuletree().then(response => {
        // 有带hasChildren的属性的话, 必须是懒加载, 否则无法加载其他层级
        this.moduleList = resolveACLModule(response.data)

        this.currentModule = this.moduleList[0]
      }).finally(_ => {
        this.loading = false
      })
    },
    handleModuleEdit(index, row) {
      this.dialogModuleFormVisible = true
      this.isEdit = true
      this.$nextTick(() => {
        this.moduleForm = {
          ...row,
          classify: [...row.classify]
        }
      })
    },
    handleModuleDelete(row) {
      this.loading = true
      deletesysAclModule({
        aclModuleKeyid: row.id
      }).then(() => {
        this.fetchList()
      }).finally(_ => {
        this.loading = false
      })
    },
    createOrEditModule() {
      this.$refs['moduleForm'].validate((valid) => {
        if (valid) {
          console.log('===> 模块表单验证通过', this.moduleForm)
          this.submiting = true
          const api = this.isEdit ? updateSysAclModule : saveSysAclModule
          const classify = this.moduleForm.classify
          const parentId = classify.length > 0 ? classify[classify.length - 1] : '0'
          api({
            ...this.moduleForm,
            parentId
          }).then(response => {
            this.fetchList()
            this.dialogModuleFormVisible = false
          }).finally(_ => {
            this.submiting = false
          })
        } else {
          console.log('===> 模块表单验证失败')
        }
      })
    },
    resetForm(formName) {
      console.log('==> resetForm', formName)
      this.$refs[formName].resetFields()
    },
    fetchModuleACL() {
      if (!this.currentModule) return
      this.loadingACL = true
      getPageByAclmodulekeyid({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        aclModuleKeyid: this.currentModule.id
      }).then(res => {
        this.aclList = res.data.data || []
        this.totalSize = res.data.size
        console.log(res)
      }).finally(_ => {
        this.loadingACL = false
      })
    },
    handleModuleChange(node) {
      this.currentModule = node
      this.currentPage = 1
      this.fetchModuleACL()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.fetchModuleACL()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.fetchModuleACL()
    },
    handleCreateACL() {
      this.isEdit = false
      this.dialogPointFormVisible = true
      this.$nextTick(_ => {
        if (this.currentModule) {
          this.pointForm.classify = [...this.currentModule.classify, this.currentModule.id]
        }
      })
    },
    handleCreateModule() {
      this.isEdit = false
      this.dialogModuleFormVisible = true
      this.$nextTick(_ => {
        if (this.currentModule) {
          this.moduleForm.classify = [...this.currentModule.classify]
        }
      })
    },
    findParent(list, id) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i]
        } else {
          if (list[i].children.length > 0) {
            const find = this.findParent(list[i].children, id)
            if (find) return find
          }
        }
      }
    },
    handleEditACL(row) {
      this.isEdit = true
      // 找到对应的上级
      const item = this.findParent(this.moduleList, row.aclModuleKeyid)
      this.dialogPointFormVisible = true
      this.$nextTick(() => {
        this.pointForm = {
          ...row,
          classify: [...item.classify, row.aclModuleKeyid]
        }
      })
    },
    handleChangeACLStatus(row) {
      const status = row.status === 1 ? 0 : 1
      updateACL({
        ...row,
        status
      }).then(_ => {
        row.status = status
      })
    },
    createOrEditPoint() {
      this.$refs['pointForm'].validate((valid) => {
        if (valid) {
          console.log('===> 权限点表单验证通过', this.pointForm)
          this.submiting = true
          const api = this.isEdit ? updateACL : saveACL
          const aclModuleKeyid = this.pointForm.classify[this.pointForm.classify.length - 1]
          api({
            ...this.pointForm,
            aclModuleKeyid
          }).then(response => {
            this.fetchModuleACL()
            this.dialogPointFormVisible = false
          }).finally(_ => {
            this.submiting = false
          })
        } else {
          console.log('===> 权限点表单验证失败')
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.el-main {
  padding: 8px 24px;
}
</style>
