<template>
    <el-row justify="center">
        <el-col :xs="12" :sm="7" style="display: flex;align-items: center;flex-direction: column;">
            <h2>VueAdmin 管理系统</h2>
            <el-image :src="img" style="width: 150px;height: 150px;"/>
            <p>联系管理员获取密码</p>
        </el-col>  
        <el-col :xs="12" :sm="7">
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
                    <el-button @click="getPass">获取密码</el-button>
                </el-form-item>
            </el-form>           
        </el-col>
    </el-row>
</template>

<script setup>
    import { reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import { useRouter } from "vue-router";
    import { useStore } from 'vuex'
    import axios from '@/plugins/axios'
    import img from '@/assets/logo.svg'
    import qs from 'qs'

    const store = useStore()
    const router = useRouter();
    const labelPosition = ref('top')
    const loginFormRef = ref()
    let captchaImg = ref()

    const formLogin = reactive({
        name: 'admin',
        password: '123456',
        captcha: '123456',
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
            axios.post('/login?'+qs.stringify(formLogin)).then(res => {
                ElMessage.success("登录成功")
                const jwt = res.headers['authorization']
                // 将jwt存储到应用store中
                store.commit("SET_TOKEN", jwt)
                router.push({
                    path: "/"
                });
            }).catch(err => {
                ElMessage.error("登录失败")
                getCaptcha()
                console.log('error submit!!');
            })
            } else {
                ElMessage.error("验证失败")
                getCaptcha();
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
        })
    }

    function getPass() {
        ElMessage("请联系管理员获取密码")
    }

    getCaptcha()
</script>

<style scoped>
.el-row{
    background-color: #fafafa;
    height: 100vh;
    align-items: center;
}
.captchaImg {
    margin-left: 8px;
    border-radius: 4px;
}

@media (max-width: 768px) {
.el-row{flex-direction: column;}
}    
</style>