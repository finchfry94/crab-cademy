<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style>
/* Remove default root styles to allow pages to control layout */
:root {
  background-color: transparent !important;
  color: inherit !important;
}
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}
#app {
  height: 100%;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}
</style>