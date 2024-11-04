<template>
    <div class="container m-5">
      <h3>您好，請問要登出嗎?</h3>
      <p v-if="user">{{ user.displayName }}</p>
      <p v-if="user">{{ user.email }}</p>
  
      <button type="submit" class="btn btn-dark btn-lg btn-block" @click="handleLogout()">
        登出
      </button>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        user: null
      };
    },
  
    methods: {
      async handleLogout() {
        try {
          await this.$store.dispatch('logOut')
          this.$router.push("/login")
  
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  </script>
  