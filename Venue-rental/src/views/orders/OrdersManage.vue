<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- 頁面標題與按鈕 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button
            @click="$router.go(-1)"
            class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <span class="mr-2">←</span>
          返回
        </button>
        <h2 class="text-2xl font-bold text-blue-500">訂單管理</h2>
      </div>
    </div>

    <!-- 篩選功能 -->
    <div class="flex space-x-4 mb-4">
      <select v-model="filterVenue" class="px-4 py-2 border rounded-lg">
        <option value="">所有場地</option>
        <option v-for="venue in venues" :key="venue" :value="venue">
          {{ venue }}
        </option>
      </select>
      <input
          type="text"
          v-model="filterUser"
          class="px-4 py-2 border rounded-lg"
          placeholder="搜尋預約人"
      />
      <select v-model="filterStatus" class="px-4 py-2 border rounded-lg">
        <option value="">所有付款狀態</option>
        <option value="true">已付款</option>
        <option value="false">未付款</option>
      </select>
      <select v-model="filterCancel" class="px-4 py-2 border rounded-lg">
        <option value="">所有訂單狀態</option>
        <option value="true">已取消</option>
        <option value="false">進行中</option>
      </select>
      <input
          type="date"
          v-model="filterDate"
          class="px-4 py-2 border rounded-lg"
          placeholder="選擇日期"
      />
    </div>

    <!-- 預約列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- 載入中提示 -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <span class="text-gray-500">載入中...</span>
      </div>

      <!-- 無資料提示 -->
      <div v-else-if="currentReservations.length === 0" class="flex justify-center items-center py-8">
        <span class="text-gray-500">目前沒有進行中的預約</span>
      </div>

      <!-- 資料表格 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th
                v-for="(header, key) in tableHeaders"
                :key="key"
                @click="sortTable(key)"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              {{ header }}
              <span v-if="sortKey === key">{{ sortAsc ? '↑' : '↓' }}</span>
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reservation in currentReservations" 
                :key="reservation.reserveId"
                class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ reservation.reserveId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_venue }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_time }}:00
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                NT$ {{ reservation.reserve_price }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_user }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-green-100 text-green-600': reservation.payment_status === true,
                  'bg-red-100 text-red-600': reservation.payment_status === false
                }">
                  {{ reservation.payment_status ? '已付款' : '未付款' }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-red-100 text-red-600': reservation.cancel_status === true,
                  'bg-green-100 text-green-600': !reservation.cancel_status
                }">
                  {{ reservation.cancel_status ? '已取消' : '進行中' }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分隔線 -->
    <div class="border-t-2 border-gray-200 my-8"></div>

    <!-- 歷史紀錄列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 bg-gray-50">
        <h3 class="text-xl font-semibold text-gray-600">歷史紀錄</h3>
      </div>
      
      <!-- 無歷史資料提示 -->
      <div v-if="historicalReservations.length === 0" class="flex justify-center items-center py-8">
        <span class="text-gray-500">暫無歷史紀錄</span>
      </div>
      
      <!-- 歷史資料表格 -->
      <div v-else class="overflow-x-auto">
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
            <tr v-for="reservation in historicalReservations" 
                :key="reservation.reserveId"
                class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ reservation.reserveId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_venue }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_time }}:00
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                NT$ {{ reservation.reserve_price }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ reservation.reserve_user }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-green-100 text-green-600': reservation.payment_status === true,
                  'bg-red-100 text-red-600': reservation.payment_status === false
                }">
                  {{ reservation.payment_status ? '已付款' : '未付款' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  已過期
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex space-x-3">
                  <button 
                    @click="openDeleteModal(reservation.reserveId)"
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
            <p class="text-gray-600">確定要刪除此預約資料嗎？此操作無法復原。</p>
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
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      reservations: [],
      venues: [],
      tableHeaders: {
        reserveId: "訂單ID",
        reserve_venue: "預約場地",
        reserve_date: "預約日期",
        reserve_time: "預約時間",
        reserve_price: "預約金額",
        reserve_user: "預約人",
        payment_status: "付款狀態",
        cancel_status: "訂單狀態",
      },
      filterVenue: "",
      filterUser: "",
      filterStatus: "",
      filterCancel: "",
      filterDate: "",
      sortKey: "reserveId",
      sortAsc: true,
      loading: true,
    };
  },

  computed: {
    currentReservations() {
      return this.reservations
        .filter(reservation => !reservation.expired_status)
        .sort((a, b) => Number(b.reserveId) - Number(a.reserveId));
    },
    historicalReservations() {
      return this.reservations
        .filter(reservation => reservation.expired_status)
        .sort((a, b) => Number(b.reserveId) - Number(a.reserveId));
    }
  },

  mounted() {
    this.getReservations();
  },
  computed: {
    filteredAndSortedReservations() {
      // 篩選
      let filtered = this.reservations.filter((res) => {
        const matchesVenue = this.filterVenue === "" || res.reserve_venue === this.filterVenue;
        const matchesUser =
            this.filterUser === "" ||
            res.reserve_user.toLowerCase().includes(this.filterUser.toLowerCase());
        const matchesStatus =
            this.filterStatus === "" || res.payment_status.toString() === this.filterStatus;
        const matchesCancel =
            this.filterCancel === "" || res.cancel_status.toString() === this.filterCancel;
        const matchesDate =
            this.filterDate === "" || res.reserve_date === this.filterDate;
        return matchesVenue && matchesUser && matchesStatus && matchesCancel && matchesDate;
      });

      // 排序
      return filtered.sort((a, b) => {
        const modifier = this.sortAsc ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    },
  },
  methods: {
    async getReservations() {
      this.loading = true;
      try {
        const querySnapshot = await getDocs(collection(db, "reservations"));
        
        // 取得今天的日期
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // 更新過期預約的狀態
        const updatePromises = [];
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          const reserveDate = new Date(data.reserve_date);
          reserveDate.setHours(0, 0, 0, 0);
          
          if (reserveDate < today && !data.expired_status) {
            // 更新過期的預約狀態
            updatePromises.push(
              updateDoc(doc.ref, {
                expired_status: true
              })
            );
          }
        });

        // 執行所有更新操作
        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
        }

        // 重新獲取更新後的預約資料
        const updatedSnapshot = await getDocs(collection(db, "reservations"));
        
        // 處理資料
        this.reservations = updatedSnapshot.docs
          .map(doc => ({
            reserveId: doc.id,
            ...doc.data(),
            expired_status: doc.data().expired_status || false
          }))
          .sort((a, b) => Number(b.reserveId) - Number(a.reserveId)); // 依照 ID 降冪排序

        // 預設按訂單ID升序排序
        this.reservations.sort((a, b) => (a.reserveId < b.reserveId ? -1 : 1));
      } catch (error) {
        console.error("獲取預約資料時發生錯誤:", error);
      } finally {
        this.loading = false;
      }
    },
    sortTable(key) {
      this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
      this.sortKey = key;
    },
  },
};
</script>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f9fafb;
}

@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
  }
}
</style>
