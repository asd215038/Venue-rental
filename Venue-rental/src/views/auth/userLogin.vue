<template>
  <div class="min-h-screen flex justify-center px-4 mt-10">
    <div class="max-w-md w-full">
      <form @submit.prevent="handleLogin">
        <h3 class="text-2xl font-semibold text-center mb-5">會員登入</h3>

        <div class="space-y-4">
          <!-- Register Button -->
        <div class="mt-4 flex justify-center pb-6">
          <router-link 
            to="/register"
            class="text-decoration underline text-lg text-blue-500 hover:text-blue-600 transition-colors duration-200">
            還沒有會員嗎？請按此註冊
          </router-link>
        </div>
          <!-- Email Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">電子郵件：</label>
            <div class="flex-1 max-w-xs">
              <input 
                type="email" 
                v-model="user.email"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            class="text-decoration underline text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            忘記密碼?
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