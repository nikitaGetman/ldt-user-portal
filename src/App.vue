<template>
  <div id="app">
    <dashboard />
  </div>
</template>

<script>
import Dashboard from '@/views/Dashboard.vue'
export default {
  name: 'App',
  components: { Dashboard }
}
</script>

<style lang="scss">
.mainpage {
  height: unset;
}
html {
  overflow: auto !important;
}
</style>
