<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button 
          @click="$router.go(-1)"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <span class="mr-2">←</span>
          返回
        </button>
        <h2 class="text-2xl font-bold text-blue-500">用戶管理</h2>
      </div>
    </div>

    <!-- 用戶列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th 
                v-for="(header, index) in tableHeaders" 
                :key="index"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="user in users" 
              :key="user.userId"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.userName }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ user.isAdmin ? '管理員' : '一般用戶' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ user.enabled ? '啟用' : '停用' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.phoneNumber || '未設定' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 若無用戶資料時顯示 -->
    <div 
      v-if="users.length === 0" 
      class="text-center py-8 text-gray-500"
    >
      目前沒有用戶資料
    </div>
  </div>
</template>

<script>
import { db } from '@/config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      users: [],
      tableHeaders: [
        "使用者名稱",
        "是否為管理員",
        "電子郵件",
        "帳號狀態",
        "聯絡電話"
      ]
    };
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
  },

  mounted() {
    this.getUsers();
  },

  methods: {
    async getUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        this.users = querySnapshot.docs.map(doc => ({
          userId: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("獲取用戶資料時發生錯誤:", error);
      }
    },
  },
}
</script>

<style scoped>
/* 確保表格在小螢幕上可以水平滾動 */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* 美化滾動條 */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>