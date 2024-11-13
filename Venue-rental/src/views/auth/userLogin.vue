<template>
  <div class="min-h-screen flex justify-center px-4 mt-10">
    <div class="max-w-md w-full">
      <form @submit.prevent="handleLogin">
        <h3 class="text-2xl font-semibold text-center mb-6">會員登入</h3>

        <div class="space-y-4">
          <!-- Email Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">電子郵件：</label>
            <div class="flex-1 max-w-xs">
              <input 
                type="email" 
                v-model="user.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">密碼：</label>
            <div class="flex-1 max-w-xs">
              <input 
                type="password" 
                v-model="user.password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Login Button -->
        <div class="mt-6 flex justify-center">
          <button 
            type="submit"
            class="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            登入
          </button>
        </div>

        <!-- Forgot Password Link -->
        <div class="mt-4 flex justify-center">
          <router-link 
            to="/forgot-password"
            class="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            忘記密碼?
          </router-link>
        </div>

        <!-- Register Button -->
        <div class="mt-4 flex justify-center">
          <router-link 
            to="/register"
            class="inline-block w-24 px-4 py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            註冊
          </router-link>
        </div>
      </form>
    </div>
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
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>