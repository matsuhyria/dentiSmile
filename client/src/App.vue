<template>
  <div>
    <NavigationBar class="fixed-navbar" />
    <router-view class="content-container"></router-view>
  </div>
</template>

<script setup>
import NavigationBar from './components/NavigationBar.vue';
</script>

<style scoped>

.fixed-navbar {
  position: fixed;
  left: 0;
  width: 100%;
}

.content-container {
  margin-top: 85px;
  padding: 5px 1px 0 1px;
  width: 100%;
  }
</style>