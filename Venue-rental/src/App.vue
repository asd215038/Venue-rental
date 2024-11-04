<template>
  <NavBar></NavBar>

  <router-view/>
</template>

<script>
import NavBar from './components/navBar.vue';
export default {
  components: {
    NavBar,
  }
};
</script>

<style>

</style>
