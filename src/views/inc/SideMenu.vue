<template>
    <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="activeName"
    text-color="#fff"
    >
        <router-link to="/index">
            <el-menu-item index="Index" @click="addTab({title: '首页', name: 'Index'})">
            <template #title>
                <el-icon><HomeFilled /></el-icon>
                <span>首页</span>
            </template>
        </el-menu-item>
        </router-link>


        <el-sub-menu v-for="menu in menuList" :index="menu.name" :key="menu.name">
            <template #title>
                <component
                :is="menu.icon"
                style="width: 1.2em; height: 1.2em; margin-right: 8px;"
                >
                </component>
                <span>{{ menu.title }}</span>
            </template>

            <router-link v-for="subMenu in menu.children" :to="subMenu.path" :key="subMenu.name">
                <el-menu-item :index="subMenu.name" @click="addTab(subMenu)">
                <template #title>
                    <component
                    :is="subMenu.icon"
                    style="width: 1.2em; height: 1.2em; margin-right: 8px;"
                    >
                    </component>
                    <span>{{ subMenu.title }}</span>
                </template>
                </el-menu-item>
            </router-link>
        </el-sub-menu>
    </el-menu>    
  </template>
 
  <script setup>
    import { ref, computed } from 'vue'
    import axios from '@/plugins/axios.js'
    import store from '@/store'

    // let menuList = ref([])

    // function getMenuList() {
    //     menuList.value = store.state.menus.menuList
    // }

    // getMenuList()    

    let menuList = computed(() => store.state.menus.menuList)

    let activeName = computed(() => store.state.menus.editableTabsValue)

    function addTab(menu) {
        store.commit('addTab', menu)
    }

  </script>
 
 <style>
    .el-menu-vertical-demo{
       height: 100vh;
    }
  </style>