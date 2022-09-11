<template>
    <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>
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
                    <el-button @click="getPass">获取密码</el-button>
                </el-form-item>
            </el-form>           
        </el-col>
    </el-row>
</template>

<script setup>
    import { reactive, ref } from 'vue'
    import { ElMessage } from 'element-plus'
    import qs from 'qs'
    import { useRouter } from "vue-router";
    import { useStore } from 'vuex'
    import axios from '@/plugins/axios'

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
    .captchaImg {
        margin-left: 8px;
        border-radius: 4px;
	}

    header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  /* width: 100%; */
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}    
</style>