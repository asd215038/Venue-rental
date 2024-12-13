<template>
  <div class="max-w-6xl mx-auto px-4 py-8 min-h-76vh">
    <!-- 頁面標題與按鈕 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button @click="$router.push('/')"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
          <span class="mr-2">←</span>
          返回
        </button>
        <h2 class="text-2xl font-bold text-blue-500">訂單查詢</h2>
      </div>
    </div>

    <!-- 訂單列表 -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-4">
        <span class="text-gray-500">載入中...</span>
      </div>
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
            <tr v-for="order in orders" :key="order.order_id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ order.order_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.reserve_venue }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.reserve_date }} {{ order.reserve_time }}:00
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                NT$ {{ order.total_amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getStatusClass(order)">
                  {{ getOrderStatus(order) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex space-x-3">
                  <button @click="viewOrderDetails(order.order_id)"
                    class="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
                    查看
                  </button>
                  <button v-if="!order.payment_status && !order.cancel_status"
                    @click="requestCancellation(order.order_id)"
                    class="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                    取消訂單
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 訂單詳情 Modal -->
    <div v-if="showOrderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">訂單詳情</h3>
            <button @click="showOrderModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="mb-6">
            <p><strong>訂單編號:</strong> {{ orderDetails.order_id }}</p>
            <p><strong>場地名稱:</strong> {{ orderDetails.reserve_venue }}</p>
            <p><strong>預約日期:</strong> {{ orderDetails.reserve_date }}</p>
            <p><strong>預約時段:</strong> {{ orderDetails.reserve_time }}:00</p>
            <p><strong>金額:</strong> NT$ {{ orderDetails.total_amount }}</p>
            <p><strong>訂單狀態:</strong> {{ getOrderStatus(orderDetails) }}</p>
          </div>
          <div class="flex justify-end">
            <button @click="showOrderModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 取消訂單 Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">取消訂單確認</h3>
            <button @click="showCancelModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="mb-6">
            <p class="text-gray-600">真的要取消訂單？</p>
          </div>
          <div class="flex justify-end space-x-4">
            <button @click="showCancelModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button @click="confirmCancellation"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import homeView from "@/views/HomeView.vue";

export default {
  computed: {
    homeView() {
      return homeView
    },
  },
  data() {
    return {
      orders: [],
      tableHeaders: ["訂單ID", "場地名稱", "預約時間", "總金額", "狀態", "操作"],
      loading: true,
      showOrderModal: false,
      showCancelModal: false,
      orderDetails: {},
      selectedOrderId: null,
    };
  },
  async created() {
    await this.fetchUserOrders();
  },
  methods: {
    // 獲取當前登入使用者的訂單
    async fetchUserOrders() {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.displayName) {
        alert("請先登入再查詢訂單");
        this.$router.push("/login");
        return;
      }

      this.loading = true;
      try {
        const ordersRef = collection(db, "reservations");
        const ordersQuery = query(
          ordersRef,
          where("reserve_user", "==", currentUser.displayName) // 改用 displayName 查詢
        );
        const querySnapshot = await getDocs(ordersQuery);

        // 取得訂單資料
        const ordersList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordersList.push({
            order_id: doc.id,
            reserve_venue: data.reserve_venue,
            reserve_date: data.reserve_date,
            reserve_time: data.reserve_time,
            total_amount: data.reserve_price,
            payment_status: data.payment_status || false,
            cancel_status: data.cancel_status || false
          });
        });

        // 根據日期排序，最新的排在前面
        this.orders = ordersList.sort((a, b) =>
          new Date(b.reserve_date) - new Date(a.reserve_date)
        );
      } catch (error) {
        console.error("獲取訂單資料時發生錯誤:", error);
        alert("無法獲取訂單資料，請稍後再試");
      } finally {
        this.loading = false;
      }
    },

    // 取得訂單狀態顯示文字
    getOrderStatus(order) {
      if (order.cancel_status) {
        return '已取消';
      }
      if (order.payment_status) {
        return '已付款';
      }
      return '待付款';
    },

    // 取得狀態顯示樣式
    getStatusClass(order) {
      return {
        'px-2 py-1 rounded-full text-xs font-medium': true,
        'bg-red-100 text-red-600': order.cancel_status,
        'bg-green-100 text-green-600': order.payment_status && !order.cancel_status,
        'bg-yellow-100 text-yellow-600': !order.payment_status && !order.cancel_status
      }
    },

    // 查看訂單詳情
    viewOrderDetails(orderId) {
      const order = this.orders.find((order) => order.order_id === orderId);
      this.orderDetails = order;
      this.showOrderModal = true;
    },

    // 發送取消訂單請求
    requestCancellation(orderId) {
      this.selectedOrderId = orderId;
      this.showCancelModal = true;
    },

    // 確認取消訂單
    async confirmCancellation() {
      if (!this.selectedOrderId) return;

      try {
        const orderRef = doc(db, "reservations", this.selectedOrderId);

        await updateDoc(orderRef, {
          cancel_status: true
        });

        // 關閉 Modal 並重置選中的訂單 ID
        this.showCancelModal = false;
        this.selectedOrderId = null;

        // 顯示成功訊息
        alert("已成功取消！");

        // 重新載入訂單資料
        await this.fetchUserOrders();
      } catch (error) {
        console.error("取消訂單時發生錯誤:", error);
        alert("取消訂單失敗，請稍後再試");
      }
    },
  },
};
</script>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
  }
}
</style>