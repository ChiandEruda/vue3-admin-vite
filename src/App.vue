<script setup>
import { RouterView } from 'vue-router'
import { watch } from 'vue'
import { useRouter } from 'vue-router';
import router from '@/router'
import store from '@/store'


// let router = useRouter()
watch(() =>router.currentRoute.value.path,(newValue,oldValue)=> {
  if(newValue !== '/login' && newValue !== '/'){
    console.log('watch',router.currentRoute.value);
    let route = router.currentRoute.value
    if(!route.name)return;
    let obj = {
      name: route.name,
      title: route.meta.title
    }

    store.commit('addTab', obj)
  }
},{ immediate: true })
</script>

<template>
  <RouterView />
</template>

<style>
  a {text-decoration: none;}
</style>