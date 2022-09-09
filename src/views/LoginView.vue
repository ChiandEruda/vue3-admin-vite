<template>
    <el-row>
        <el-col>
            <el-form
                :label-position="labelPosition"
                label-width="100px"
                :model="formLogin"
                :rules="rules"
                style="max-width: 460px"
                ref="loginFormRef"
            >
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="formLogin.name" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="formLogin.password" />
                </el-form-item>

                <el-form-item label="验证码" prop="captcha">
                    <el-input v-model="formLogin.captcha" maxlength="5" style="width: 100px"/>
                    <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submit(loginFormRef)">提交</el-button>
                    <el-button @click="reset(loginFormRef)">重置</el-button>
                </el-form-item>
            </el-form>           
        </el-col>
        <el-col></el-col>
        <el-col></el-col>
    </el-row>
</template>

<script setup>
    import { reactive, ref } from 'vue'
    import axios from '@/plugins/axios'

    const labelPosition = ref('top')
    const loginFormRef = ref()
    let captchaImg = ref()

    const formLogin = reactive({
        name: '',
        password: '',
        captcha: '',
    })

    const rules = reactive({
        name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度为 3 - 5 个字符', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
    })

    async function submit(activeForm) {
        if (!activeForm) return
        await activeForm.validate((valid, fields) => {
            if (valid) {
            axios.post('/login').then(res => {
                console.log('/login')
            })
            console.log('submit!')
            } else {
            console.log('error submit!', fields)
            }
        })        
    }

    function reset(resetForm) {
        if (!resetForm) return
        resetForm.resetFields()
    }

    function getCaptcha() {
        axios.get('/captcha').then(res => {
            console.log('/captcha')
            captchaImg.value = res.data.data.captchaImg
            console.log(captchaImg)
        })
    }

    getCaptcha()
</script>

<style scoped>
    .captchaImg {
        margin-left: 8px;
        border-radius: 4px;
	}
</style>