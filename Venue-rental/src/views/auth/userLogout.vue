<template>
  <div class="min-h-screen flex justify-center px-4 mt-10">
    <div class="max-w-md w-full">
      <div>
        <h3 class="text-2xl font-semibold text-center mb-6">登出確認</h3>
        
        <div class="space-y-4">
          <!-- 用戶資訊區塊 -->
          <div class="bg-gray-50 p-6 rounded-lg mb-6" v-if="user">
            <div class="flex items-center justify-center space-x-2 mb-2">
              <span class="font-medium">使用者名稱：</span>
              <span class="text-gray-700">{{ user.displayName }}</span>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <span class="font-medium">電子郵件：</span>
              <span class="text-gray-700">{{ user.email }}</span>
            </div>
          </div>

          <!-- 確認提示文字 -->
          <p class="text-center text-gray-600 mb-6">
            您確定要登出系統嗎？
          </p>

          <!-- 登出按鈕 -->
          <div class="flex justify-center">
            <button 
              @click="handleLogout"
              class="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              確認登出
            </button>
          </div>

          <!-- 返回首頁連結 -->
          <div class="mt-4 flex justify-center">
            <router-link 
              to="/"
              class="text-decoration underline text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              返回首頁
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user; 
    }
  },

  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('logOut');
        this.$router.push("/login");
      } catch (error) {
        console.error("登出錯誤:", error);
      }
    }
  }
};
</script>

<style scoped>
/* 如果需要額外的樣式可以在這裡添加 */
</style>