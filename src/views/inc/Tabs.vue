<template>
    <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { computed } from 'vue'
import store from '@/store'
import router from '@/router'


const editableTabsValue = computed(() => store.state.menus.editableTabsValue)
const editableTabs = computed(() => store.state.menus.editableTabs)

const removeTab = (targetName) => {
  store.commit('removeTab', targetName)
}

const clickTab = (target, event) => {
    console.log(target.paneName)
    store.commit('changeTab', target.paneName)
    router.push({name: target.paneName})
}
</script>

<style scoped>
</style>