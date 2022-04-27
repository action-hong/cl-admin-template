<!--  -->
<template>
  <el-container class="app-container">
    <el-aside
      width="400px"
      style="background-color: #ffffff"
    >
      <div>
        <el-button
          type="primary"
          @click="handleCreateRole"
        >
          新增角色
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="roles"
        row-key="id"
        style="margin-top: 10px;"
        border
      >
        <el-table-column
          prop="name"
          label="角色名"
        />
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditRole(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-aside>
    <el-dialog
      v-loading="submiting"
      title="新增/编辑角色"
      :visible.sync="dialogRoleVisible"
      :close-on-click-modal="false"
      @closed="resetForm('roleForm')"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="roleRules"
      >
        <el-form-item label="id" prop="id" hidden>
          <el-input v-model="roleForm.id" @keyup.enter.native="createOrEditRole" />
        </el-form-item>
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="roleForm.name" @keyup.enter.native="createOrEditRole" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="roleForm.remark" @keyup.enter.native="createOrEditRole" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="createOrEditRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { getRolelist, saveRole, updateRole } from '@/api'

export default {
  components: {},
  data() {
    return {
      loading: false,
      isEdit: false,
      submiting: false,
      dialogRoleVisible: false,
      roleForm: {
        id: '',
        name: '',
        type: 2,
        status: 1,
        remark: ''
      },
      roles: [],
      roleRules: {
        name: [
          {
            required: true,
            message: '请输入角色名称'
          },
          {
            min: 2,
            max: 20,
            message: '角色名称长度在 2 到 20 个字符'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    this.fetchRole()
  },
  methods: {
    fetchRole() {
      this.loading = true
      getRolelist()
        .then(res => {
          this.roles = res.data
        }).finally(_ => {
          this.loading = false
        })
    },
    handleCreateRole() {
      this.isEdit = false
      this.dialogRoleVisible = true
    },
    handleEditRole(row) {
      this.isEdit = true
      this.dialogRoleVisible = true
      this.$nextTick(_ => {
        this.roleForm = Object.assign({}, row)
      })
    },
    resetForm(formName) {
      console.log('==> resetForm', formName)
      this.$refs[formName].resetFields()
    },
    createOrEditRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          this.submiting = true
          const api = this.isEdit ? updateRole : saveRole
          api({
            ...this.roleForm
          }).then(_ => {
            this.submiting = false
            this.dialogRoleVisible = false
            this.$message({
              message: '新增/更新成功',
              type: 'success'
            })
            this.fetchRole()
          }).finally(_ => {
            this.submiting = false
          })
        }
      })
    }
  }

}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>
