<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- 頁面標題與按鈕 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button @click="$router.go(-1)"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
          <span class="mr-2">←</span>
          返回
        </button>
        <h2 class="text-2xl font-bold text-blue-500">訂單管理</h2>
      </div>
    </div>

    <!-- 篩選功能 -->
    <div class="flex space-x-4 mb-4">
      <select v-model="selectedVenues" class="px-4 py-2 border rounded-lg">
        <option value="">所有場地</option>
        <option v-for="venue in filterVenue" :key="venue" :value="venue">
          {{ venue }}
        </option>
      </select>
      <input type="text" v-model="filterUser" class="px-4 py-2 border rounded-lg" placeholder="搜尋預約人" />
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
      <input type="date" v-model="filterDate" class="px-4 py-2 border rounded-lg" placeholder="選擇日期" />
      <button @click="resetFilters"
        class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
        重置篩選
      </button>
    </div>
    <!-- 重置按鈕 -->

    <!-- 預約列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- 載入中提示 -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <span class="text-gray-500">載入中...</span>
      </div>

      <!-- 無資料提示 -->
      <div v-else-if="reservations.length === 0" class="flex justify-center items-center py-8">
        <span class="text-gray-500">目前沒有預約資料</span>
      </div>

      <!-- 資料表格 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="(header, key) in tableHeaders" :key="key" @click="sortTable(key)"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                {{ header }}
                <span v-if="sortKey === key">{{ sortAsc ? '↑' : '↓' }}</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reservation in currentReservations" :key="reservation.reserveId"
              class="hover:bg-gray-50 transition-colors">
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
                  'bg-green-100 text-green-600': reservation.cancel_status === false
                }">
                  {{ reservation.cancel_status ? '已取消' : '進行中' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
                <th v-for="(header, index) in tableHeaders" :key="index"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="reservation in historicalReservations" :key="reservation.reserveId"
                class="hover:bg-gray-50 transition-colors">
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      reservations: [],
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
      filterVenue: [],
      filterUser: "",
      filterStatus: "",
      filterCancel: "",
      filterDate: "",
      selectedVenues: "",
      sortKey: "reserveId",
      sortAsc: true,
      loading: true,
    };
  },

  async mounted() {
    await Promise.all([
      this.getReservations(),
      this.getVenueCategories()
    ]);
  },

  computed: {
    filteredAndSortedReservations() {
      let filtered = this.reservations.filter((res) => {
        const matchesVenue = this.filterVenue.length === 0 || this.filterVenue.includes(res.reserve_venue);
        const matchesUser = this.filterUser === "" ||
          res.reserve_user.toLowerCase().includes(this.filterUser.toLowerCase());
        const matchesStatus = this.filterStatus === "" ||
          res.payment_status.toString() === this.filterStatus;
        const matchesCancel = this.filterCancel === "" ||
          res.cancel_status.toString() === this.filterCancel;
        const matchesDate = this.filterDate === "" ||
          res.reserve_date === this.filterDate;
        return matchesVenue && matchesUser && matchesStatus && matchesCancel && matchesDate;
      });

      return filtered.sort((a, b) => {
        const modifier = this.sortAsc ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    },

    currentReservations() {
      return this.filteredAndSortedReservations.filter(reservation => !reservation.expired_status);
    },

    historicalReservations() {
      return this.filteredAndSortedReservations.filter(reservation => reservation.expired_status);
    }
  },

  methods: {
    async getVenueCategories() {
      try {
        const venuesSnapshot = await getDocs(collection(db, "venues"));
        const categories = venuesSnapshot.docs.map(doc => doc.data().category);
        this.filterVenue = categories;
      } catch (error) {
        console.error("獲取場地類別時發生錯誤:", error);
      }
    },

    async getReservations() {
      this.loading = true;
      try {
        const querySnapshot = await getDocs(collection(db, "reservations"));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const reservations = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const reserveDate = new Date(data.reserve_date);
          reserveDate.setHours(0, 0, 0, 0);

          return {
            reserveId: doc.id,
            ...data,
            expired_status: reserveDate < today
          };
        });

        this.reservations = reservations;
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
    resetFilters() {
      this.selectedVenues = "";
      this.filterUser = "";
      this.filterStatus = "";
      this.filterCancel = "";
      this.filterDate = "";
      this.sortKey = "reserveId";
      this.sortAsc = true;
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
