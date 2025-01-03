<template>
  <div class="min-h-7/10 flex justify-center px-4 mt-10">
    <div class="max-w-md w-full">
      <form @submit.prevent="handleLogin">
        <h3 class="text-2xl font-semibold text-center mb-5">會員登入</h3>

        <div class="space-y-4">
          <!-- Register Button -->
          <div class="mt-4 flex justify-center pb-6">
            <router-link to="/register"
              class="text-decoration underline text-lg text-blue-500 hover:text-blue-600 transition-colors duration-200">
              還沒有會員嗎？請按此註冊
            </router-link>
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
        </div>

        <!-- Login Button -->
        <div class="mt-6 flex justify-center">
          <button type="submit"
            class="px-6 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            登入
          </button>
        </div>

        <!-- Forgot Password Link -->
        <div class="mt-4 flex justify-center">
          <router-link to="/forgotPassword"
            class="text-decoration underline text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200">
            忘記密碼?
          </router-link>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      loginError: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // 先檢查用戶是否被軟刪除
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", this.user.email)
        );

        const querySnapshot = await getDocs(userQuery);

        // 檢查是否找到用戶且是否被刪除
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.is_delete) {
            toast.error("此帳號已被停用，請聯繫管理員。", {
              autoClose: 1000,
              position: toast.POSITION.TOP_CENTER,
            });
            return;
          }
        }

        // 嘗試用 Firebase 登入
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.user.email,
          this.user.password
        );

        const user = userCredential.user;

        // 檢查是否已經驗證電子郵件
        if (!user.emailVerified) {
          // 如果未驗證，強制登出並顯示錯誤訊息
          await auth.signOut();
          return;
        }

        toast.success("登入成功！", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 如果登入成功，將用戶重定向到主頁
        this.$router.push("/");
      } catch (error) {
        let msg = "";
        switch (error.code) {
          case 'auth/user-not-found':
            msg = "用戶未找到，請確認您的電子郵件地址是否正確。";
            break;
          case 'auth/wrong-password':
            msg = "密碼錯誤，請再試一次。";
            break;
          case 'auth/missing-password':
            msg = "請輸入密碼。";
            break;
          case 'auth/invalid-email':
            msg = "無效的電子郵件地址";
            break;
          default:
            msg = "登入失敗：" + error.message;
        }
        toast.error(msg, {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  }
};
</script>

<style scoped>
/* 你可以在這裡加上額外的樣式 */
</style>
