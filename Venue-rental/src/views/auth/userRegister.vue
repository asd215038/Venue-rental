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
              <input type="text" v-model="user.userName"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <!-- Email Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">電子郵件：</label>
            <div class="flex-1 max-w-xs">
              <input type="email" v-model="user.email"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <!-- Password Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">密碼：</label>
            <div class="flex-1 max-w-xs">
              <input type="password" v-model="user.password"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <!-- Confirm Password Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">確認密碼：</label>
            <div class="flex-1 max-w-xs">
              <input type="password" v-model="confirmPassword"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <!-- Phone Number Input -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">手機號碼：</label>
            <div class="flex-1 max-w-xs">
              <input type="text" v-model="user.phoneNumber"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <!-- Gender Select -->
          <div class="flex items-center justify-end space-x-2">
            <label class="w-20 text-right">性別：</label>
            <div class="flex-1 max-w-xs">
              <select v-model="user.gender"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
              <input type="date" v-model="user.birth"
                class="w-4/5 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <!-- Register Button -->
        <div class="mt-6 flex justify-center">
          <button type="submit"
            class="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            註冊
          </button>
        </div>

        <!-- Login Link -->
        <div class="mt-4 flex justify-center">
          <router-link to="/login"
            class="text-decoration underline text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200">
            已經有帳號了？請按此登入
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { db } from '@/config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export default {
  data() {
    return {
      user: {
        userName: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: "",
        birth: ""
      },
      confirmPassword: "",
    };
  },
  methods: {
    async registerAndPost() {
      // 密碼檢查
      if (this.user.password !== this.confirmPassword) {
        alert("密碼不一致，請確認密碼。");
        return;
      }

      // 密碼長度檢查
      if (this.user.password.length < 6) {
        alert("密碼長度至少需要6個字元");
        return;
      }

      try {
        const auth = getAuth();

        // 註冊用戶
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.user.email,
          this.user.password
        );

        const user = userCredential.user;

        // 設定 displayName
        await updateProfile(user, {
          displayName: this.user.userName
        });

        // 發送驗證信
        await sendEmailVerification(user);

        alert("註冊成功！驗證信已發送到您的信箱，請查收。");

        // 儲存用戶資料到 Firestore
        await addDoc(collection(db, "users"), {
          userName: this.user.userName,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber,
          gender: this.user.gender,
          birthDate: this.user.birth,
          uid: user.uid  // 加入 user ID 作為參考
        });

        // 註冊後導航到主頁或其他頁面
        this.$router.push("/login");
      } catch (error) {
        // 更詳細的錯誤處理
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('此電子郵件已被使用');
            break;
          case 'auth/invalid-email':
            alert('無效的電子郵件地址');
            break;
          default:
            alert("註冊失敗：" + error.message);
        }
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
/* 你可以在這裡加上額外的樣式 */
</style>
