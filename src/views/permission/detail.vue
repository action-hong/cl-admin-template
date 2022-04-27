<!--  -->
<template>
  <el-container class="app-container">
    <el-header>
      <el-button
        v-loading="loading"
        type="primary"
        @click="fetchList"
      >刷新</el-button>
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
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            prop="name"
            label="模块名称"
          />
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleModuleEdit(scope.$index, scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>
      <el-main>Main</el-main>
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
  </el-container>
</template>

<script>
import { getSysAclModuletree, updateSysAclModule, saveSysAclModule } from '@/api'
import { resolveACLModule } from '@/utils'
export default {
  components: {},
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
        status: 1,
        // 级联
        classify: []
      },
      moduleRules: {
        name: [
          {
            required: true,
            message: '请输入模块名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
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
      }).finally(_ => {
        this.loading = false
      })
    },
    handleModuleEdit(index, row) {
      this.dialogModuleFormVisible = true
      this.isEdit = true
      this.moduleForm = Object.assign({}, row)
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
          }).finally(_ => {
            this.submiting = false
            this.dialogModuleFormVisible = false
          })
        } else {
          console.log('===> 模块表单验证失败')
        }
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
        status: 1,
        classify: []
      }
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>
