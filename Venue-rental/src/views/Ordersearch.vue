<template>
  <div class="max-w-6xl mx-auto px-4 py-8 min-h-76vh">
    <!-- 頁面標題與按鈕 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.push('/')"
          class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
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
              v-for="order in orders"
              :key="order.original_id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ order.order_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.original_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.reserve_venue }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.reserve_date }} {{ order.reserve_time }}:00
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.order_date }}
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
                {{ order.payment_accunt_last_five_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex space-x-3">
                  <button
                    @click="viewOrderDetails(order.original_id)"
                    class="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    查看
                  </button>
                  <button
                    v-if="!order.payment_status && !order.cancel_status"
                    @click="openCancelModal(order.original_id)"
                    class="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
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
    <div
      v-if="showOrderModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">訂單詳情</h3>
            <button
              @click="showOrderModal = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="mb-6">
            <p><strong>訂單序號:</strong> {{ orderDetails.order_id }}</p>
            <p><strong>訂單ID:</strong> {{ orderDetails.original_id }}</p>
            <p><strong>場地名稱:</strong> {{ orderDetails.reserve_venue }}</p>
            <p><strong>預約日期:</strong> {{ orderDetails.reserve_date }}</p>
            <p><strong>預約時段:</strong> {{ orderDetails.reserve_time }}:00</p>
            <p><strong>金額:</strong> NT$ {{ orderDetails.total_amount }}</p>
            <p><strong>訂單狀態:</strong> {{ getOrderStatus(orderDetails) }}</p>
            <p><strong>匯款帳號:</strong> {{ formatVirtualAccount(virtualAccount) }}</p>
            <p class="flex items-center gap-3 mb-2">
              <strong>付款帳號末五碼:</strong>
              <input
                v-model="payment_accunt_last_five_number"
                type="text"
                class="border border-gray-300 rounded px-3 py-1 w-32"
                maxlength="5"
              />
              <button
                @click="updatePaymentAccuntLastFiveNumber"
                class="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                確認
              </button>
            </p>
          </div>
          <div class="flex justify-end">
            <button
              @click="showOrderModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 取消訂單 Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">取消訂單確認</h3>
            <button
              @click="showCancelModal = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="mb-6">
            <p class="text-gray-600">真的要取消訂單？</p>
          </div>
          <div class="flex justify-end space-x-4">
            <button
              @click="showCancelModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              @click="confirmCancellation"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
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
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      orders: [],
      tableHeaders: [
        "訂單序號",
        "訂單ID",
        "場地名稱",
        "預約時間",
        "訂單日期",
        "總金額",
        "狀態",
        "付款帳號末五碼",
        "操作",
      ],
      loading: true,
      showOrderModal: false,
      showCancelModal: false,
      orderDetails: {},
      selectedOrderId: null,
      payment_accunt_last_five_number: "",
      virtualAccount:""
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
          where("reserve_user", "==", currentUser.displayName)
        );
        const querySnapshot = await getDocs(ordersQuery);

        let ordersList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ordersList.push({
            original_id: doc.id,
            reserve_venue: data.reserve_venue,
            reserve_date: data.reserve_date,
            reserve_time: data.reserve_time,
            order_date: data.order_date || data.reserve_date,
            total_amount: data.reserve_price,
            virtual_account: data.virtual_account || "無虛擬帳號", // 獲取虛擬帳號
            payment_status: data.payment_status || false,
            cancel_status: data.cancel_status || false,
            payment_accunt_last_five_number:
              data.payment_accunt_last_five_number,
          });
        });

        ordersList = ordersList.sort(
          (a, b) => new Date(a.order_date) - new Date(b.order_date)
        );

        this.orders = ordersList.map((order, index) => ({
          ...order,
          order_id: (index + 1).toString().padStart(4, "0"),
        }));
      } catch (error) {
        toast.error("無法獲取訂單資料，請稍後再試", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      } finally {
        this.loading = false;
      }
    },
    getOrderStatus(order) {
      if (order.cancel_status) return "已取消";
      if (order.payment_status) return "已付款";
      return "待付款";
    },
    getStatusClass(order) {
      return {
        "px-2 py-1 rounded-full text-xs font-medium": true,
        "bg-red-100 text-red-600": order.cancel_status,
        "bg-green-100 text-green-600":
          order.payment_status && !order.cancel_status,
        "bg-yellow-100 text-yellow-600":
          !order.payment_status && !order.cancel_status,
      };
    },
    viewOrderDetails(orderId) {
      this.orderDetails = this.orders.find((order) => order.original_id === orderId);
      this.virtualAccount = this.orderDetails.virtual_account; // 將虛擬帳號設定為當前訂單的虛擬帳號
      this.showOrderModal = true;
    },
    formatVirtualAccount(account) {
      if (!account) return "無虛擬帳號"; // 如果帳號為空，顯示提示

      // 去除非數字字符和空格
      const cleanedAccount = account.replace(/\D+/g, "");

      // 確保每4位添加一個 "-" 並處理所有數字
      return cleanedAccount.replace(/(.{4})/g, "$1-").replace(/-$/, ""); // 最後可能多餘的 "-" 移除
  },
    openCancelModal(orderId) {
      this.selectedOrderId = orderId;
      this.showCancelModal = true;
    },
    async confirmCancellation() {
      if (!this.selectedOrderId) return;

      try {
        const orderRef = doc(db, "reservations", this.selectedOrderId);
        await updateDoc(orderRef, { cancel_status: true });

        this.showCancelModal = false;
        this.selectedOrderId = null;
        toast.success("已成功取消！", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
        await this.fetchUserOrders();
      } catch (error) {
        toast.error("取消訂單失敗，請稍後再試", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    },
    async updatePaymentAccuntLastFiveNumber() {
      try {
        const orderRef = doc(db, "reservations", this.orderDetails.original_id);
        const updateData = {
          payment_accunt_last_five_number: this.payment_accunt_last_five_number,
        };
        await updateDoc(orderRef, updateData);
        toast.success("付款帳號末五碼資料更新成功！", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
        await this.fetchUserOrders();
        this.showOrderModal = false;
      } catch (error) {
        toast.error("更新付款帳號末五碼資料失敗：" + error, {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });

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
