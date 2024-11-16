<template>
  <div class="min-h-screen flex justify-center px-4 mt-10">
    <div class="max-w-md w-full">
      <form @submit.prevent="registerAndPost">
        <h3 class="text-2xl font-semibold text-center mb-6">會員註冊</h3>

        <div class="space-y-4">
          <!-- Name Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">姓名：</label>
            <div class="flex-1 max-w-xs">
              <input 
                type="text" 
                v-model="user.userName"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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

          <!-- Confirm Password Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">確認密碼：</label>
            <div class="flex-1 max-w-xs">
              <input 
                type="password" 
                v-model="confirmPassword"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Phone Number Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">手機號碼：</label>
            <div class="flex-1 max-w-xs">
              <input 
                type="text" 
                v-model="user.phoneNumber"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Gender Select -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">性別：</label>
            <div class="flex-1 max-w-xs">
              <select 
                v-model="user.gender"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>

          <!-- Birth Date Selects -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">出生日期：</label>
            <div class="flex-1 max-w-xs">
              <input 
                type="date" 
                v-model="user.birth"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Register Button -->
        <div class="mt-6 flex justify-center">
          <button 
            type="submit"
            class="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            註冊
          </button>
        </div>

        <!-- Login Link -->
        <div class="mt-4 flex justify-center">
          <router-link 
            to="/login"
            class="text-decoration underline text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            已經有帳號了？請按此登入
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from '@/config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export default {
  data() {
    return {
      user: {
        userName: "",
        isAdmin: false,
        email: "",
        password: "",
        enabled: false,
        phoneNumber: "",
        gender: "",
        birthYear: "",
        birthMonth: "",
        birthDay: ""
      },
      confirmPassword: "",
      years: Array.from({ length: 35 }, (_, i) => 1990 + i)
    };
  },
  computed: {
    daysInMonth() {
      const year = this.user.birthYear || 1990;
      const month = this.user.birthMonth || 1;
      return new Date(year, month, 0).getDate();
    }
  },
  methods: {
    async registerAndPost() {
      if (this.user.password !== this.confirmPassword) {
        alert("密碼不一致，請確認密碼。");
        return;
      }

      try {
        await this.$store.dispatch('register', {
          email: this.user.email,
          password: this.user.password,
          name: this.user.userName
        });
        
        await addDoc(collection(db, "users"), {
          userName: this.user.userName,
          isAdmin: this.user.isAdmin,
          email: this.user.email,
          password: this.user.password,
          enabled: this.user.enabled,
          phoneNumber: this.user.phoneNumber,
          gender: this.user.gender,
          birthDate: `${this.user.birthYear}-${this.user.birthMonth}-${this.user.birthDay}`
        });

        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>