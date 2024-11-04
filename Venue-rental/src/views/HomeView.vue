<template>
  <div class="home">

  </div>
</template>

<script>


export default {
  name: 'HomeView',
  
  computed: {
    user() {
      console.log(this.$store.state.user)
      return this.$store.state.user
    },
    isLoggedIn() {
      console.log(this.$store.state.user.loggedIn)
      return this.$store.state.user.loggedIn
    }
  }
}
</script>
