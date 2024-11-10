<template>
  <NavBar></NavBar>
  <div class="container">
    <router-view />
    <Footer></Footer>
  </div>
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
