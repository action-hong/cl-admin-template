<template>
  <div class="dashboard-container">
    你好, {{ name }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 8px;
}

</style>
