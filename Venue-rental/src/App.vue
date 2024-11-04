<template>
  <NavBar></NavBar>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/navBar.vue';
export default {
  components: {
    NavBar,
  }
};
</script>

<style></style>
