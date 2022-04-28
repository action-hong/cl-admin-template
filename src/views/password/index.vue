<template>
  <div class="app-container">
    <el-card class="modify-container">
      <div slot="header" class="clearfix">
        <span>修改密码</span>
      </div>
      <el-form ref="form" :model="ruleForm" status-icon :rules="rules" label-width="100px" label-position="top">
        <!-- <el-form-item label="旧密码" prop="userPassword">
          <el-input v-model="ruleForm.userPassword" type="password" autocomplete="off" />
        </el-form-item> -->
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" placeholder="必须包含大小写,数字,特殊字符且为(8-16)位" />
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword2">
          <el-input v-model="ruleForm.newPassword2" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm('form')">{{ loading ? '提交中' : '提交' }}</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { modifyPassword } from '@/api'
import { mapGetters } from 'vuex'
import md5 from 'md5'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.newPassword2 !== '') {
          this.$refs.form.validateField('newPassword2')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '长度大于6个字符', trigger: 'change' },
          { validator: validatePass, trigger: 'change' }
        ],
        newPassword2: [
          { required: true, message: '请再次输入密码', trigger: 'change' },
          { min: 6, message: '长度大于6个字符', trigger: 'change' },
          { validator: validatePass2, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['id'])
  },
  methods: {
    submitForm(formName) {
      if (this.loading) return
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('==> ', this.ruleForm.newPassword)
          modifyPassword({
            id: this.id,
            password: md5(this.ruleForm.newPassword).toUpperCase()
          })
            .then(_ => {
              this.$notify({
                type: 'success',
                message: '修改密码成功'
              })
              this.resetForm(formName)
            }).finally(_ => {
              this.loading = false
            })
        } else {
          this.loading = false
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.modify-container {
  width: 480px;
}
</style>
