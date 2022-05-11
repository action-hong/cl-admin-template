<!--  -->
<template>
  <el-container class="app-container">
    <el-aside
      width="400px"
      style="background-color: #ffffff"
    >
      <div>
        <el-button
          v-permission="$data.$clPermission.PERMISSION_CODE_ADD_DEPT"
          type="primary"
          @click="handleCreateDept"
        >
          新增部门
        </el-button>
        <el-button
          v-permission="$data.$clPermission.PERMISSION_CODE_ADD_SYSTEM_USER"
          type="primary"
          @click="handleCreateUser"
        >
          新增系统用户
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="depts"
        row-key="id"
        style="margin-top: 10px;"
        highlight-current-row
        default-expand-all
        border
        :tree-props="{
          children: 'deptList',
          hasChildren: 'hasChildren'
        }"
        @current-change="handleDeptChange"
      >
        <el-table-column
          prop="name"
          label="部门"
        />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <template
              v-permission="$data.$clPermission.PERMISSION_CODE_EDIT_DEPT"
            >
              <el-button
                size="mini"
                @click="handleEditDept(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
            </template>
            <el-popconfirm
              v-permission="$data.$clPermission.PERMISSION_CODE_REMOVE_DEPT"
              title="确定删除吗?"
              @onConfirm="handleDeleteDept(scope.row)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

    </el-aside>
    <el-main>
      <p>当前部门: {{ currentDept.name }}</p>
      <el-divider />
      <el-table
        v-loading="loadingUser"
        :data="deptUser"
        row-key="id"
        empty-text="该部门暂时没有员工"
        border
      >
        <el-table-column
          prop="username"
          label="姓名"
        />
        <el-table-column
          prop="mail"
          label="email"
        />
        <el-table-column
          prop="telephone"
          label="电话"
        />
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditUser(scope.row)"
            >编辑</el-button>
            <el-divider direction="vertical" />
            <el-button
              size="mini"
              @click="handleEnableUser(scope.row)"
            >{{ scope.row.status == 2 ? '启用' : '禁用' }}</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm
              title="是否重置密码?"
              @onConfirm="handleResetPassword(scope.row)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
              >重置</el-button>
            </el-popconfirm>
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
    <el-dialog
      v-loading="submiting"
      title="新增/编辑部门"
      :visible.sync="dialogDeptFormVisible"
      :close-on-click-modal="false"
      @closed="resetForm('deptForm')"
    >
      <el-form
        ref="deptForm"
        :model="deptForm"
        :rules="deptRules"
      >
        <el-form-item label="id" prop="id" hidden>
          <el-input v-model="deptForm.id" />
        </el-form-item>
        <el-form-item
          prop="classify"
          label="上级模块"
        >
          <el-cascader
            v-model="deptForm.classify"
            :props="{ checkStrictly: true }"
            :options="disableDeptOptions"
            placeholder="--"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="deptForm.name" />
        </el-form-item>
        <el-form-item label="顺序" prop="seq">
          <el-input-number v-model="deptForm.seq" :min="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="deptForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeptFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrEditDept">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="submiting"
      title="新增/编辑用户"
      :visible.sync="dialogUserFromVisiable"
      :close-on-click-modal="false"
      @closed="resetForm('userForm')"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRuels"
      >
        <el-form-item label="id" prop="id" hidden>
          <el-input v-model="userForm.id" />
        </el-form-item>
        <el-form-item label="deptId" prop="deptId" hidden>
          <el-input v-model="userForm.deptId" />
        </el-form-item>
        <el-form-item
          prop="classify"
          label="上级模块"
        >
          <el-cascader
            v-model="userForm.classify"
            :props="{ checkStrictly: true }"
            :options="deptOptions"
            placeholder="--"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称" prop="username" required>
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mail" required>
          <el-input v-model="userForm.mail" />
        </el-form-item>
        <el-form-item label="电话" prop="telephone" required>
          <el-input v-model="userForm.telephone" />
        </el-form-item>
        <el-form-item label="顺序" prop="seq">
          <el-input-number v-model="userForm.seq" :min="0" />
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input v-model="userForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserFromVisiable = false">取 消</el-button>
        <el-button type="primary" @click="createOrEditUser">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { deleteDept, getDeptTree, getPageByDeptkeyid, resetUserPassword, saveDept, saveUser, updateDept, updateUser } from '@/api'
import { resolveDept } from '@/utils'
export default {
  components: {},
  data() {
    return {
      loading: false,
      depts: [],
      currentDept: {
        id: '',
        name: ''
      },
      dialogDeptFormVisible: false,
      deptForm: {
        id: '',
        name: '',
        parentId: '',
        seq: 0,
        remark: '',
        classify: []
      },
      isEdit: false,
      deptRules: {
        name: [
          {
            required: true,
            message: '请输入部门名称'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符'
          }
        ]
      },
      submiting: false,
      // 用户
      deptUser: [],
      loadingUser: false,
      pageSize: 10,
      totalSize: 0,
      currentPage: 1,
      dialogUserFromVisiable: false,
      userForm: {
        id: '',
        username: '',
        telephone: '',
        mail: '',
        deptId: '',
        status: 2,
        remark: ''
      },
      userRuels: {
        username: [
          {
            required: true,
            message: '请输入名称'
          }
        ]
      }
    }
  },
  computed: {
    disableDeptOptions() {
      const id = this.deptForm.id
      function resolveModule(list) {
        return list.map(item => {
          return {
            value: item.id,
            label: item.name,
            disabled: item.id === id,
            children: item.deptList.length > 0 ? resolveModule(item.deptList || []) : []
          }
        })
      }
      return resolveModule(this.depts || [])
    },
    deptOptions() {
      function resolveModule(list) {
        return list.map(item => {
          return {
            value: item.id,
            label: item.name,
            children: item.deptList.length > 0 ? resolveModule(item.deptList) : []
          }
        })
      }
      return resolveModule(this.depts)
    }
  },
  mounted() {
    this.fetchDepts()
  },
  methods: {
    fetchDepts() {
      this.loading = true
      getDeptTree()
        .then(res => {
          this.depts = resolveDept(res.data)
          this.handleDeptChange(this.depts[0])
        }).finally(_ => {
          this.loading = false
        })
    },
    handleCreateDept() {
      this.isEdit = false
      this.dialogDeptFormVisible = true
    },
    handleEditDept(row) {
      this.isEdit = true
      this.dialogDeptFormVisible = true
      this.$nextTick(() => {
        this.deptForm = {
          ...row,
          classify: [...row.classify]
        }
      })
    },
    handleDeleteDept(row) {
      this.loading = true
      deleteDept({
        deptId: row.id
      }).then(() => {
        this.fetchDepts()
      }).finally(_ => {
        this.loading = false
      })
    },
    handleDeptChange(row) {
      this.currentDept = row
      this.currentPage = 1
      this.fetchDeptUser()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    createOrEditDept() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          this.submiting = true
          const params = {
            ...this.deptForm
          }
          const api = this.isEdit ? updateDept : saveDept
          const classify = this.deptForm.classify
          const parentId = classify.length > 0 ? classify[classify.length - 1] : ''
          api({
            ...params,
            parentId
          }).then(response => {
            this.fetchDepts()
            this.dialogDeptFormVisible = false
          }).finally(_ => {
            this.submiting = false
          })
        }
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.fetchDeptUser()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.fetchDeptUser()
    },
    fetchDeptUser() {
      if (!this.currentDept) return
      this.loadingUser = true
      getPageByDeptkeyid({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        deptKeyid: this.currentDept.id
      }).then(res => {
        this.deptUser = res.data.data || []
        this.totalSize = res.data.size
        console.log(res)
      }).finally(_ => {
        this.loadingUser = false
      })
    },
    handleCreateUser() {
      this.isEdit = false
      this.dialogUserFromVisiable = true
      this.$nextTick(_ => {
        if (this.currentDept) {
          this.userForm.classify = [...this.currentDept.classify, this.currentDept.id]
        }
      })
    },
    handleEditUser(row) {
      this.isEdit = true
      // 找到对应的上级
      const item = this.findParent(this.depts, row.deptKeyid)
      this.dialogUserFromVisiable = true
      this.$nextTick(() => {
        this.userForm = {
          ...row,
          classify: [...item.classify, row.deptKeyid]
        }
      })
    },
    handleEnableUser(row) {
      const status = row.status === 2 ? 1 : 2
      updateUser({
        ...row,
        deptId: row.deptKeyid,
        status
      }).then(_ => {
        this.fetchDeptUser()
      })
    },
    findParent(list, id) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i]
        } else {
          if (list[i].deptList.length > 0) {
            const find = this.findParent(list[i].deptList, id)
            if (find) return find
          }
        }
      }
    },
    createOrEditUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.submiting = true
          const params = {
            ...this.userForm
          }
          const deptId = this.userForm.classify[this.userForm.classify.length - 1]
          const api = this.isEdit ? updateUser : saveUser
          api({
            ...params,
            deptId
          }).then(response => {
            this.fetchDeptUser()
            this.dialogUserFromVisiable = false
            if (!this.isEdit) {
              this.$notify({
                message: '创建成功，密码为: ' + response.data.password,
                duration: 0,
                type: 'success'
              })
            }
          }).finally(_ => {
            this.submiting = false
          })
        }
      })
    },
    handleResetPassword(row) {
      resetUserPassword({
        id: row.id
      }).then((res) => {
        this.$notify({
          message: res.msg,
          duration: 0,
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>
