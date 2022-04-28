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
        highlight-current-row
        border
        @current-change="handleRoleChange"
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
    <el-main>
      <p>
        当前选择的角色: {{ currentRole.name }}
      </p>
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          v-loading="loadingRoleAcl"
          label="角色与权限"
          name="first"
        >
          <el-tree
            ref="roleAclTree"
            :props="{
              label: 'name',
              children: 'children'
            }"
            :data="roleAclTree"
            default-expand-all
            node-key="id"
            show-checkbox
          >
            <span slot-scope="{ data }" class="custom-tree-node">
              <i v-if="data.myType === 'group'" class="el-icon-folder" />
              <span style="margin-left: 8px;">{{ data.name }}</span>
            </span>
          </el-tree>
          <el-button
            style="margin-top: 15px;"
            type="primary"
            @click="updateRoleAcl"
          >更新权限</el-button>
        </el-tab-pane>
        <el-tab-pane
          v-loading="loadingRoleUser"
          label="角色与用户"
          name="second"
        >
          <el-transfer
            v-model="currentRoleUsers"
            :titles="['不属于该角色的用户', '属于该角色的用户']"
            filterable
            :data="roleUserList"
            :props="{
              key: 'id',
              label: 'username'
            }"
          />
          <el-button
            style="margin-top: 15px;"
            type="primary"
            @click="updateRoleUsers"
          >更新角色对应的用户</el-button>
          <el-button
            style="margin-top: 15px;"
            type="primary"
            @click="resetRoleUsers"
          >重置</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-main>
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
import { changeRoleAcls, changeRoleUsers, getRolelist, getRoleTree, getRoleUsers, saveRole, updateRole } from '@/api'
import { resolveModuleForTree, getRoleAcl, getAllAcl } from '@/utils'

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
      },
      currentRole: {
        id: '',
        name: ''
      },
      activeName: 'first',
      loadingRoleAcl: false,
      loadingRoleUser: false,
      roleAclTree: [],
      roleUserList: [],
      tempRolueUsers: [],
      currentRoleUsers: []
    }
  },
  computed: {

  },
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
          if (this.roles.length > 0) {
            this.currentRole = this.roles[0]
            this.fetchRoleRelative()
          }
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
    },
    handleRoleChange(role) {
      this.currentRole = role
      this.fetchRoleRelative()
    },
    fetchRoleRelative() {
      this.fetchRoleAcl()
      this.fetchRoleUser()
    },
    fetchRoleAcl() {
      this.loadingRoleAcl = true
      getRoleTree({
        roleId: this.currentRole.id
      }).then(res => {
        this.roleAclTree = resolveModuleForTree(res.data)
        // checked
        const aclIds = getRoleAcl(res.data)
        this.$refs['roleAclTree'].setCheckedKeys(aclIds)
      }).finally(_ => {
        this.loadingRoleAcl = false
      })
    },
    fetchRoleUser() {
      this.loadingRoleUser = true
      getRoleUsers({
        roleId: this.currentRole.id
      }).then(res => {
        this.roleUserList = [
          ...res.data.unselected,
          ...res.data.selected
        ]
        this.currentRoleUsers = res.data.selected.map(item => item.id)
        this.tempRolueUsers = [...this.currentRoleUsers]
      }).finally(_ => {
        this.loadingRoleUser = false
      })
    },
    updateRoleAcl() {
      if (this.loadingRoleAcl) return
      const nodes = this.$refs['roleAclTree'].getCheckedNodes()
      const ids = nodes.map(item => item.myType === 'group' ? getAllAcl(item) : item.id).flat().join(',')
      this.loadingRoleAcl = true
      changeRoleAcls({
        aclIds: ids,
        roleId: this.currentRole.id
      }).then(_ => {
        this.$message({
          type: 'success',
          message: '权限更新成功'
        })
      }).finally(_ => {
        this.loadingRoleAcl = false
      })
    },
    updateRoleUsers() {
      console.log('updateRoleUsers')
      if (this.loadingRoleUser) return
      const ids = this.currentRoleUsers.join(',')
      this.loadingRoleUser = true
      changeRoleUsers({
        roleId: this.currentRole.id,
        userIds: ids
      }).then(_ => {
        this.$message({
          type: 'success',
          message: '角色用户更新成功'
        })
        this.tempRolueUsers = [...this.currentRoleUsers]
      }).finally(_ => {
        this.loadingRoleUser = false
      })
    },
    resetRoleUsers() {
      if (this.loadingRoleUser) return
      this.currentRoleUsers = [...this.tempRolueUsers]
    }
  }

}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>
