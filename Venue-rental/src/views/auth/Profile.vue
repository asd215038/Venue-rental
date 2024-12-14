<template>
  <div class="min-h-screen flex items-center justify-center  px-4">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h3 class="text-2xl font-bold text-center text-blue-600 mb-6">修改個人資料</h3>

      <form @submit.prevent="updateProfile">
        <div class="space-y-6">
          <!-- Name Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">姓名：</label>
            <input
                type="text"
                v-model="user.userName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="請輸入您的姓名"
            />
          </div>

          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">電子郵件：</label>
            <input
                type="email"
                v-model="user.email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm sm:text-sm bg-gray-100"
                readonly
            />
          </div>

          <!-- Phone Number Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">手機號碼：</label>
            <input
                type="text"
                v-model="user.phoneNumber"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="請輸入您的手機號碼"
            />
          </div>

          <!-- Gender Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700">性別：</label>
            <select
                v-model="user.gender"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>

          <!-- Birth Date Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">出生日期：</label>
            <input
                type="date"
                v-model="user.birthDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <!-- Save Button -->
        <div class="mt-8">
          <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            儲存修改
          </button>
        </div>

        <!-- Success/Error Message -->
        <div v-if="successMessage" class="mt-4 text-center text-green-600 font-medium">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="mt-4 text-center text-red-600 font-medium">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "@/config/firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      user: {
        userName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        birthDate: "",
      },
      successMessage: null,
      errorMessage: null,
    };
  },
  async created() {
    await this.loadUserData();
  },
  methods: {
    async loadUserData() {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("請先登入");
        this.$router.push("/login");
        return;
      }

      console.log("目前登入的用戶電子郵件：", currentUser.email);

      try {
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log("成功加載用戶資料：", userData);

          this.user = {
            userName: userData.userName || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            gender: userData.gender || "",
            birthDate: userData.birthDate || "",
          };
        } else {
          console.error("未找到用戶資料：", currentUser.email);
          this.errorMessage = "未找到用戶資料，請聯繫管理員。";
        }
      } catch (error) {
        console.error("加載用戶資料失敗：", error);
        this.errorMessage = "加載用戶資料時發生錯誤，請稍後再試。";
      }
    },
    async updateProfile() {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        this.errorMessage = "用戶未登入，無法更新資料。";
        return;
      }

      try {
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDocRef = querySnapshot.docs[0].ref;

          await updateDoc(userDocRef, {
            userName: this.user.userName,
            phoneNumber: this.user.phoneNumber,
            gender: this.user.gender,
            birthDate: this.user.birthDate,
          });

          await updateProfile(currentUser, {
            displayName: this.user.userName,
          });

          this.successMessage = "個人資料已成功更新！";
        } else {
          this.errorMessage = "更新資料失敗，未找到用戶。";
        }
      } catch (error) {
        console.error("更新資料失敗：", error);
        this.errorMessage = "更新資料失敗，請稍後再試。";
      }
    },
  },
};
</script>

<style scoped>
/* 增加頁面背景顏色 */
body {
  background-color: #f3f4f6;
}
</style>
