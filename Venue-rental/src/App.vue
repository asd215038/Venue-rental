<template>
  <NavBar></NavBar>
  <router-view />
  <Footer></Footer>
</template>

<script>
import NavBar from './components/navBar.vue';
import Footer from './components/footer.vue';
export default {
  components: {
    NavBar,
    Footer
  }
};
</script>

<style>

</style>
