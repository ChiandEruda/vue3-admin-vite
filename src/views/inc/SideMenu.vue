<template>
    <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="2"
    text-color="#fff"
    >
        <el-menu-item index="0">
        <template #title>
            <el-icon><HomeFilled /></el-icon>
        <span>首页</span>
        </template>
        </el-menu-item>

    <el-sub-menu index="1">
        <template #title>
        <el-icon><Operation /></el-icon>
        <span>系统管理</span>
        </template>
        <el-menu-item index="1-1">
        <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
        </template>
        </el-menu-item>
        <el-menu-item index="1-2">
        <template #title>
            <el-icon><Rank /></el-icon>
            <span>角色管理</span>
        </template>
        </el-menu-item>
        <el-menu-item index="1-3">
        <template #title>
            <el-icon><IconMenu /></el-icon>
            <span>菜单管理</span>
        </template>
        </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="2">
        <template #title>
        <el-icon><Tools /></el-icon>
        <span>系统工具</span>
        </template>
        <el-menu-item index="2-1">
        <template #title>
            <el-icon><List /></el-icon>
            <span>数字字典</span>
        </template>
        </el-menu-item>
    </el-sub-menu>
    </el-menu>    
  </template>
 
  <script setup>
 import {  
    Operation, 
    Tools, 
    UserFilled, 
    Rank, 
    List, 
    HomeFilled, 
    Menu as IconMenu
  } from '@element-plus/icons-vue'
  </script>
 
 <style>
    .el-menu-vertical-demo{
       height: 100vh;
    }
  </style>