<template>
	<el-container>
	   <el-aside width="200px">
		  <SideMenu />
	   </el-aside>
 
	   <el-container>
		  <el-header>
			 <strong>VueAdmin后台管理系统</strong>
 
			 <div class="header-avatar">
 
				<el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
 
				<el-dropdown trigger="click">
				   <span class="el-dropdown-link">
				   {{ userInfo.username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
				   </span>
				   <template #dropdown>
					  <el-dropdown-menu>
						 <el-dropdown-item :icon="User">
							<router-link to="/userCenter">用户中心</router-link>
						</el-dropdown-item>
						 <el-dropdown-item :icon="SwitchButton" @click.native="logout">退出</el-dropdown-item>
					  </el-dropdown-menu>
				   </template>
				</el-dropdown>
 
				<el-link href="https://markerhub.com" target="_blank">网站</el-link>
				<el-link href="https://space.bilibili.com/13491144" target="_blank">B站</el-link>
			 </div>
		  </el-header>
		  <el-main>
			<router-view></router-view>
		  </el-main>
	   </el-container>
	</el-container>
</template>
 
<script setup>
 import {  
	ArrowDown,
	User, 
	SwitchButton 
  } from '@element-plus/icons-vue'
  import SideMenu from '@/views/inc/SideMenu.vue'
  import { ref } from 'vue'
  import store from '@/store'
  import router from '@/router'
  import axios from '@/plugins/axios.js'

  let userInfo = ref({
	id: '',
	username: '',
	avatar: ''
  })

  function getUserInfo() {
	axios.get('/sys/user').then(res => {
		userInfo.value = res.data.data
		console.log(res.data.data)
	})
  }

  function logout() {
	axios.post('/logout').then(res => {
		localStorage.clear()
		sessionStorage.clear()
		store.commit('resetState')

		router.push({
			path: '/login'
		})
	})
  }

  getUserInfo()

</script>
 
<style scoped>
	 .header-avatar {
		 float: right;
		 width: 210px;
		 display: flex;
		 justify-content: space-around;
		 align-items: center;
	 }
 
	.el-dropdown-link {
	   cursor: pointer;
	}
 
	.el-header {
	  background-color: #17b3a3;
	  color: #333;
	  text-align: center;
	  line-height: 60px;
	}
	
	.el-aside {
	  background-color: #D3DCE6;
	  color: #333;
	  text-align: center;
	  line-height: 200px;
	}
	
	.el-main {
	  background-color: #E9EEF3;
	  color: #333;
	  text-align: center;
	  line-height: 160px;
	}
	
	body > .el-container {
	  margin-bottom: 40px;
	}
	
	.el-container:nth-child(5) .el-aside,
	.el-container:nth-child(6) .el-aside {
	  line-height: 260px;
	}
	
	.el-container:nth-child(7) .el-aside {
	  line-height: 320px;
	}
</style>