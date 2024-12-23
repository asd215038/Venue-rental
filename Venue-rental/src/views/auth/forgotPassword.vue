<template>
  <div class="min-h-screen flex justify-center px-4 mt-10">
    <div class="max-w-md w-full">
      <form @submit.prevent="forgetPassword">
        <h3 class="text-2xl font-semibold text-center mb-6">忘記密碼</h3>

        <div class="space-y-4">
          <!-- Email Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">電子郵件：</label>
            <div class="flex-1 max-w-xs">
              <input
                  type="email"
                  v-model="email"
                  class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="請輸入您的電子信箱"
              />
            </div>
          </div>
        </div>

        <!-- Reset Password Button -->
        <div class="mt-6 flex justify-center">
          <button
              type="submit"
              class="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              :disabled="loading"
          >
            <span v-if="loading">請稍候...</span>
            <span v-else>重設密碼</span>
          </button>
        </div>

        <!-- Success or Error Message -->
        <div v-if="successMessage" class="mt-4 text-center text-green-500">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mt-4 text-center text-red-500">
          {{ errorMessage }}
        </div>

        <!-- Back to Login Link -->
        <div class="mt-4 flex justify-center">
          <router-link
              to="/login"
              class="text-decoration underline text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            返回登入頁面
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      loading: false,
      successMessage: null,
      errorMessage: null,
    };
  },
  methods: {
    async forgetPassword() {
      // 清空訊息
      this.successMessage = null;
      this.errorMessage = null;

      if (!this.email) {
        this.errorMessage = "請輸入電子信箱";
        return;
      }

      this.loading = true;

      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, this.email);
        this.successMessage = "重設密碼的電子郵件已發送，請檢查您的信箱。";
        this.email = ""; // 重置輸入框
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            this.errorMessage = "此電子信箱未註冊過。";
            break;
          case "auth/invalid-email":
            this.errorMessage = "電子信箱格式不正確。";
            break;
          default:
            this.errorMessage = "發送失敗：" + error.message;
        }
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 保持樣式一致性 */
</style>
