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
          @click="handleCreateDept"
        >
          新增部门
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
            <el-button
              size="mini"
              @click="handleEditDept(scope.row)"
            >编辑</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm
              title="确定删除吗?"
              @onConfirm="handleDeleteDept(scope.row)"
            >
              <el-button
                slot="reference"
                size="mini"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

    </el-aside>
    <el-main />
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
  </el-container>
</template>

<script>
import { deleteDept, getDeptTree, saveDept, updateDept } from '@/api'
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
      submiting: false
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
    handleDeptChange() {},
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
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>
