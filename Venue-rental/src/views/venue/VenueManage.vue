<template>
    <backendNavbar />

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 頁面標題與按鈕 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-blue-500">場地管理</h2>
        </div>
        <router-link 
          to="/manage/venue/add"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <span class="mr-2">+</span>
          新增場地
        </router-link>
      </div>
  
      <!-- 場地列表 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="(header, index) in tableHeaders" 
                    :key="index" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="venue in venues" 
                  :key="venue.venueId"
                  class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ venue.venueId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ venue.venues_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  NT$ {{ venue.price_per_hour }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ venue.capacity }} 人
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex space-x-3">
                    <button 
                      @click="editVenue(venue.venueId)"
                      class="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      編輯
                    </button>
                    <button 
                      @click="openDeleteModal(venue.venueId)"
                      class="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- 刪除確認 Modal -->
      <div 
        v-if="showDeleteModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-900">確認刪除</h3>
              <button 
                @click="showDeleteModal = false"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span class="text-2xl">&times;</span>
              </button>
            </div>
            <div class="mb-6">
              <p class="text-gray-600">確定要刪除此場地資料嗎？此操作無法復原。</p>
            </div>
            <div class="flex justify-end space-x-4">
              <button 
                @click="showDeleteModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                @click="confirmDelete"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/config/firebaseConfig';
  import backendNavbar from '@/components/backendNavbar.vue';
  import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
  
  export default {
    components: {
      backendNavbar
    },
    data() {
      return {
        venues: [],
        tableHeaders: ["場地ID", "場地名稱", "每小時費用", "容納人數", "操作"],
        showDeleteModal: false,
        venueIdToDelete: null,
      };
    },
  
    mounted() {
      this.getVenues();
    },
  
    methods: {
      async getVenues() {
        try {
          const querySnapshot = await getDocs(collection(db, "venues"));
          this.venues = querySnapshot.docs.map(doc => ({
            venueId: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.error("獲取場地資料時發生錯誤:", error);
        }
      },
  
      openDeleteModal(venueId) {
        this.venueIdToDelete = venueId;
        this.showDeleteModal = true;
      },
  
      async confirmDelete() {
        if (this.venueIdToDelete) {
          try {
            await deleteDoc(doc(db, "venues", this.venueIdToDelete));
            await this.getVenues(); // 重新載入場地列表
            console.log("場地資料已成功刪除！");
          } catch (error) {
            console.error("刪除資料時發生錯誤:", error);
          }
          this.venueIdToDelete = null;
          this.showDeleteModal = false;
        }
      },
  
      editVenue(venueId) {
        this.$router.push({ name: 'EditVenue', params: { venueId } });
      },
    },
  }
  </script>
  
  <style scoped>
  /* 確保表格在小螢幕上可以水平滾動 */
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
  
  /* 確保模態框在行動裝置上有適當的邊距 */
  @media (max-width: 640px) {
    .modal-content {
      margin: 1rem;
    }
  }
  </style>