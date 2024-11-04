<template>
    <div class="container m-5">
      <form action="#" @submit.prevent="handleLogin">
        <h3>登入</h3>
  
        <div class="form-group">
          <label>郵件地址</label>
          <input
            type="email"
            class="form-control form-control-lg"
            v-model="user.email"
          />
        </div>
  
        <div class="form-group">
          <label>密碼</label>
          <input
            type="password"
            class="form-control form-control-lg"
            v-model="user.password"
          />
        </div>
  
        <button type="submit" class="btn btn-dark btn-lg btn-block">登入</button>
        <button class="btn btn-dark btn-lg btn-block">
          <router-link to="/register">
            註冊
          </router-link>
        </button>
  
        <p class="forgot-password text-right mt-2 mb-4">
          <router-link to="/forgot-password">忘記密碼?</router-link>
        </p>
      </form>
    </div>
  </template>
  
  <script>

  export default {
    data() {
      return {
        user: {
          email: "",
          password: "",
        },
      };
    },
    methods: {
      async handleLogin() {
        console.log("login")
        try {
          await this.$store.dispatch('logIn', {
          email: this.user.email,
          password: this.user.password,
        })
        this.$router.push("/")

        } catch(error) {
          console.log(error);
        }
      }
    }
  };
  </script>