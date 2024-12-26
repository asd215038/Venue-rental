<template>
  <backendNavbar />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <h2 class="text-2xl font-bold text-blue-500">使用者管理</h2>
      </div>
    </div>

    <!-- 用戶列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.userId" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ user.userId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.userName }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.isAdmin ? '管理員' : '一般用戶' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ user.enabled ? '啟用' : '停用' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.phoneNumber || '未設定' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="user.is_delete ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                  {{ user.is_delete ? '已刪除' : '使用中' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-800">
                  編輯
                </button>
                <button @click="toggleDeleteStatus(user.userId, user.is_delete)"
                        :class="user.is_delete ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'">
                  {{ user.is_delete ? '還原' : '刪除' }}
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 若無用戶資料時顯示 -->
    <div v-if="users.length === 0" class="text-center py-8 text-gray-500">
      目前沒有用戶資料
    </div>

    <!-- 編輯模態框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-center text-blue-600 mb-4">編輯用戶資料</h3>
        <form @submit.prevent="updateUser">
          <div class="space-y-4">
            <!-- 使用者名稱 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">使用者名稱：</label>
              <input
                  type="text"
                  v-model="editUserData.userName"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- 電子郵件 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">電子郵件：</label>
              <input
                  type="email"
                  v-model="editUserData.email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm sm:text-sm bg-gray-100"
                  readonly
              />
            </div>

            <!-- 帳號狀態 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">帳號狀態：</label>
              <select
                  v-model="editUserData.enabled"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option :value="true">啟用</option>
                <option :value="false">停用</option>
              </select>
            </div>

            <!-- 是否為管理員 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">是否為管理員：</label>
              <select
                  v-model="editUserData.isAdmin"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option :value="true">是</option>
                <option :value="false">否</option>
              </select>
            </div>

            <!-- 聯絡電話 -->
            <div>
              <label class="block text-sm font-medium text-gray-700">手機號碼：</label>
              <input
                  type="text"
                  v-model="editUserData.phoneNumber"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-4">
            <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
            <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebaseConfig";
import backendNavbar from '@/components/backendNavbar.vue';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  components: {
    backendNavbar
  },
  data() {
    return {
      users: [],
      tableHeaders: [
        "ID",
        "使用者名稱",
        "是否為管理員",
        "電子郵件",
        "帳號狀態",
        "聯絡電話",
        "是否刪除",
        "操作",
      ],
      showEditModal: false,
      editUserData: {},
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        this.users = querySnapshot.docs.map((doc) => ({
          userId: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("獲取用戶資料時發生錯誤:", error);
      }
    },
    openEditModal(user) {
      this.editUserData = { ...user }; // 複製選取的用戶資料
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editUserData = {};
    },
    async updateUser() {
      try {
        const userRef = doc(db, "users", this.editUserData.userId);
        await updateDoc(userRef, {
          userName: this.editUserData.userName,
          phoneNumber: this.editUserData.phoneNumber,
          enabled: this.editUserData.enabled,
          isAdmin: this.editUserData.isAdmin,
        });
        toast.success("用戶資料更新成功！", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
        this.closeEditModal();
        await this.getUsers(); // 重新載入用戶列表
      } catch (error) {
        toast.error("更新失敗，請稍後再試！" + error, {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    },
    async toggleDeleteStatus(userId, currentStatus) {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          is_delete: !currentStatus,
        });
        await this.getUsers();
        toast.info(currentStatus ? "用戶已還原" : "用戶已刪除", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      } catch (error) {
        toast.error("操作失敗", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    },
  },
};
</script>
