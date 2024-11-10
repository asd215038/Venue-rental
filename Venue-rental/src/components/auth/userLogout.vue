<template>
  <div class="container m-5">
    <h3>您好，請問要登出嗎?</h3>
    <p v-if="user">{{ user.displayName }}</p>
    <p v-if="user">{{ user.email }}</p>

    <button type="submit" class="btn btn-dark btn-lg btn-block" @click="handleLogout">
      登出
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user; // 從 Vuex 中獲取當前用戶資料
    }
  },

  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('logOut');  // 呼叫 Vuex 中的登出 action
        this.$router.push("/login");  // 登出後重定向到登入頁面
      } catch (error) {
        console.error("登出錯誤:", error);  // 顯示錯誤訊息
      }
    }
  }
};
</script>
