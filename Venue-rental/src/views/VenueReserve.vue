<template>
  <div
    class="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen"
  >
    <!-- 篩選器 -->
    <div
      class="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-wrap items-center gap-4 transform hover:scale-[1.01] transition-all duration-300"
    >
      <select
        v-model="selectedVenue"
        class="flex-1 px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-100 outline-none transition-all duration-200"
      >
        <option value="">{{ venueName || "選擇場地" }}</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
      <input
        type="date"
        v-model="selectedDate"
        @change="fetchBookedSlots"
        class="flex-1 px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-100 outline-none transition-all duration-200"
        :min="today"
      />
    </div>

    <!-- 預約時間表 -->
<div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
    <h2 class="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
      場地預約
    </h2>
    <p class="text-sm text-gray-500 bg-blue-50 px-3 py-1.5 rounded-full">
      {{ formattedSelectedDate }}
    </p>
  </div>

  <div class="overflow-x-auto -mx-4 sm:mx-0">
    <table class="table-auto w-full border-separate border-spacing-0 time-table min-w-[800px]">
      <thead>
        <tr class="bg-gradient-to-r from-blue-50 to-purple-50">
          <th class="px-2 sm:px-4 py-2 border border-blue-100 rounded-tl-lg text-blue-600 whitespace-nowrap text-sm">
            時間
          </th>
          <th v-for="(day, index) in weekDays" 
              :key="index"
              class="px-2 sm:px-4 py-2 border border-blue-100 text-center text-blue-600 whitespace-nowrap text-sm"
              :class="{ 'rounded-tr-lg': index === weekDays.length - 1 }">
            {{ day.dayName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hour in hours" :key="hour">
          <td class="px-2 sm:px-4 py-1.5 border border-blue-100 text-center font-medium text-gray-600 text-sm whitespace-nowrap">
            {{ hour }}:00-{{ hour + 1 }}:00
          </td>
          <td v-for="(day, index) in weekDays"
              :key="index"
              class="px-1 sm:px-2 py-1 border border-blue-100 text-center"
              @mousedown="startDrag(day, hour)"
              @mouseover="handleDrag(day, hour)"
              @mouseup="endDrag"
              @mouseleave="isDragging && handleDrag(day, hour)">
            <button :disabled="isBooked(day.date, hour)"
                    :class="{
                      'bg-blue-100 text-blue-600': isSelected(day.dayName, hour),
                      'bg-red-100 text-red-500': isBooked(day.date, hour),
                      'text-gray-600 hover:bg-blue-200 hover:text-blue-700': !isSelected(day.dayName, hour) && !isBooked(day.date, hour),
                    }"
                    class="w-full py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium">
              {{ isBooked(day.date, hour) ? "已預約" : isSelected(day.dayName, hour) ? "已選" : "可預約" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    <!-- 訂單資訊區域 -->
    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
      <!-- 訂單資訊標題和內容 -->
      <div class="mb-8">
        <h3
          class="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-100"
        >
          訂單資訊
        </h3>

        <!-- 沒有選取時的顯示 -->
        <div
          v-if="selectedSlots.length === 0"
          class="text-center py-8 bg-blue-50 rounded-xl"
        >
          <p class="text-blue-600 font-medium">尚未選擇任何時段</p>
          <p class="text-blue-400 mt-2">請在上方時間表選擇您想要預約的時段</p>
        </div>

        <!-- 有選取時的顯示 -->
        <div v-else class="space-y-6">
          <div
            class="flex items-center text-gray-700 bg-blue-50 p-4 rounded-lg"
          >
            <span class="font-medium min-w-24">場地：</span>
            <span class="text-blue-600">{{ selectedVenue }}</span>
          </div>
          <div
            class="flex items-center text-gray-700 bg-blue-50 p-4 rounded-lg"
          >
            <span class="font-medium min-w-24">日期：</span>
            <span class="text-blue-600">{{ today }}</span>
          </div>

          <!-- 選取的時段列表 -->
          <div
            class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 space-y-3"
          >
            <p class="font-medium text-gray-700 mb-4">已選時段：</p>
            <div
              v-for="slot in selectedSlots"
              :key="slot.day + slot.hour"
              class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span class="text-gray-600">
                {{ slot.date }} - {{ slot.day }} - {{ slot.hour }}:00 -
                {{ slot.hour + 1 }}:00
              </span>
              <span
                class="font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full"
              >
                NT$ {{ pricePerHour }}
              </span>
            </div>
          </div>

          <!-- 總金額 -->
          <div
            class="flex justify-between items-center pt-6 border-t-2 border-blue-100 mt-6"
          >
            <span class="text-xl font-medium text-gray-700">總金額</span>
            <span
              class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              NT$ {{ totalAmount }}
            </span>
          </div>
        </div>
      </div>

      <!-- 付款選項 -->
      <div class="mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">付款方式</h3>
        <div class="space-y-3">
          <label
            class="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors duration-200"
          >
            <input
              type="radio"
              v-model="paymentMethod"
              value="online"
              class="w-5 h-5 text-blue-600 border-2 border-blue-200 focus:ring-blue-500"
            />
            <span class="text-gray-700">線上付款</span>
          </label>
        </div>
      </div>

      <!-- 使用者條款 -->
      <div class="mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">使用者條款</h3>
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <ul class="text-gray-600 space-y-4">
            <li
              v-for="(item, index) in [
                '場地零租僅提供至當日閉館前30分鐘為止。',
                '借用時段包含架設及撤場時間，請自行預留足夠時間。',
                '確定預約場地後，需於24小時內完成繳費，超過繳費期限系統將自動取消訂單。',
                '借用開始時間前15分鐘開放報到，請至一樓櫃檯辦理報到。',
                '報到完成後，請依現場工作人員提供的場地編號使用場地。',
                '逾時使用15分鐘以上者，將酌收0.5小時超時費；超過30分鐘者，將酌收1小時超時費，並於超時30分鐘後進行清場。因清場產生之相關損失，需自行負責。',
                '已完成繳費的訂單，如因故需取消或變更場地、時間，應於場地使用時間前四小時提出異動或取消。其餘詳細規範將依「場地使用規範」辦理，逾時恕不受理，感謝您的配合。',
              ]"
              :key="index"
              class="flex gap-4 p-3 bg-white rounded-lg shadow-sm"
            >
              <span class="font-medium text-blue-600">{{ index + 1 }}.</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 同意條款 -->
      <div class="flex items-center mb-8 p-4 bg-blue-50 rounded-lg">
        <input
          type="checkbox"
          v-model="acceptedTerms"
          class="w-5 h-5 text-blue-600 border-2 border-blue-200 rounded focus:ring-blue-500"
        />
        <label class="ml-3 text-gray-600">我已閱讀並同意上述條款</label>
      </div>

      <!-- 確認按鈕 -->
      <button
        @click="submitOrder"
        :disabled="!acceptedTerms || selectedSlots.length === 0"
        class="w-full py-4 bg-blue-400 text-white rounded-xl font-medium hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        確認預約
      </button>
    </div>

    <!-- 確認選擇場地Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        @click="closeModal"
      ></div>
      <div
        class="bg-white rounded-xl p-8 z-10 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300"
      >
        <h3 class="text-xl font-bold text-gray-800 mb-4">提示</h3>
        <p class="text-gray-600 mb-6">請先選擇場地後再進行預約。</p>
        <button
          @click="closeModal"
          class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          了解
        </button>
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
  setDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      showModal: false,
      categories: [], // 場地類型
      selectedVenue: "", // 選擇的場地
      selectedDate: new Date().toISOString().split("T")[0], // 默認為今天
      weekDays: [], // 動態生成的一周日期
      hours: Array.from({ length: 15 }, (_, i) => 8 + i), // 08:00 - 22:00 的時段
      selectedSlots: [], // 用戶選擇的時段
      bookedSlots: {}, // 已被預約的時段
      acceptedTerms: false, // 是否同意條款
      pricePerHour: 0, // 每小時價格
      today: new Date().toISOString().split("T")[0], // 今天的日期
      paymentMethod: "",
      q: [],
      payment_status: false,
      cancel_status: false,
      expired_status: false,
      payment_accunt_last_five_number: "",
      isDragging: false,
      dragStart: null,
      dragEnd: null,
    };
  },
  async created() {
    await this.initializeComponent();
  },
  computed: {
    totalAmount() {
      return this.selectedSlots.length * this.pricePerHour;
    },
    formattedSelectedDate() {
      const date = new Date(this.selectedDate);
      return date.toLocaleDateString("zh-TW", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    },
    venueName() {
      return this.$store.state.selectedVenueName;
    },
  },
  beforeRouteLeave(to, from, next) {
    // 清除場地狀態
    this.$store.dispatch("cleanVenueName");
    next();
  },
  methods: {
    async initializeComponent() {
      await this.fetchVenues();
      this.updateWeekDays();

      // 初始化時設置從 store 來的場地
      const venueFromStore = this.$store.state.selectedVenueName;
      if (venueFromStore) {
        this.selectedVenue = venueFromStore;
        await this.fetchBookedSlots();
      }
    },
    closeModal() {
      this.showModal = false;
    },
    // 修改切換時段選擇方法
    toggleSelection(day, hour, date) {
      if (!this.selectedVenue) {
        this.showModal = true;
        return;
      }
      const slot = { day, hour, date };
      const index = this.selectedSlots.findIndex(
        (slot) => slot.day === day && slot.hour === hour
      );
      if (index === -1) {
        this.selectedSlots.push(slot);
      } else {
        this.selectedSlots.splice(index, 1);
      }
    },
    // 更新一周的日期
    updateWeekDays() {
      const today = new Date(this.selectedDate); // 使用 selectedDate 而不是 today

      this.weekDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        return {
          dayName: date.toLocaleDateString("zh-TW", {
            month: "numeric",
            day: "numeric",
            weekday: "short",
          }),
          date: date.toISOString().split("T")[0],
        };
      });
    },

    // 獲取場地列表
    async fetchVenues() {
      try {
        const venuesRef = collection(db, "venues");
        const querySnapshot = await getDocs(venuesRef);

        const venuesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.venues_name) {
            venuesList.push(data.venues_name);
          }
        });

        this.categories = venuesList;
        console.log("場地列表:", this.categories);
      } catch (error) {
        console.error("獲取場地列表時發生錯誤:", error);
      }
    },

    async fetchVenuePrice(venueName) {
      try {
        const venuesRef = collection(db, "venues");
        const q = query(venuesRef, where("venues_name", "==", venueName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const venueData = querySnapshot.docs[0].data();
          this.pricePerHour = venueData.price_per_hour;
        }
      } catch (error) {
        console.error("獲取場地價格時發生錯誤:", error);
      }
    },

    // 從 Firebase 獲取已預約的時段
    async fetchBookedSlots() {
      if (!this.selectedVenue) {
        this.bookedSlots = {};
        return;
      }
      try {
        const venueRef = collection(db, "reservations");
        // 獲取所有預約記錄
        const querySnapshot = await getDocs(venueRef);
        console.log("總共找到", querySnapshot.size, "筆預約紀錄");

        const organizedBookings = {};

        // 在 JavaScript 中進行資料過濾和整理
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // 只處理當前選擇的場地
          if (data.reserve_venue === this.selectedVenue) {
            const { reserve_date, reserve_time } = data;

            // 檢查日期是否在當前週範圍內
            if (
              reserve_date >= this.weekDays[0].date &&
              reserve_date <= this.weekDays[6].date
            ) {
              if (!organizedBookings[reserve_date]) {
                organizedBookings[reserve_date] = new Set(); // 使用 Set 避免重複
              }
              organizedBookings[reserve_date].add(reserve_time);
            }
          }
        });

        // 將整理後的資料存入 bookedSlots
        const slots = {};
        Object.entries(organizedBookings).forEach(([date, timeSet]) => {
          // 將 Set 轉為陣列並排序
          const sortedTimes = Array.from(timeSet).sort(
            (a, b) => parseInt(a) - parseInt(b)
          );
          sortedTimes.forEach((time) => {
            const key = `${date}-${time}`;
            slots[key] = true;
          });
        });

        this.bookedSlots = slots;
        console.log(`${this.selectedVenue} 的預約狀態:`, this.bookedSlots);
      } catch (error) {
        console.error("獲取預約資料時發生錯誤:", error);
      }
    },
    // 檢查時段是否已被預約
    isBooked(date, hour) {
      const key = `${date}-${hour.toString()}`;
      return this.bookedSlots[key] || false;
    },
    // 檢查時段是否已選
    isSelected(day, hour) {
      return this.selectedSlots.some(
        (slot) => slot.day === day && slot.hour === hour
      );
    },
    // 提交訂單
    async submitOrder() {
      const auth = getAuth();

      if (!auth.currentUser) {
        alert("請先登入再進行預約");
        this.$router.push("/login");
        return;
      }
      if (!this.paymentMethod) {
        toast.warn("請選擇付款方式", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      if (!this.acceptedTerms) {
        toast.warn("請先同意使用者條款", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      try {
        // 先獲取目前集合的文件數量
        const querySnapshot = await getDocs(collection(db, "reservations"));
        let currentCount = querySnapshot.size;

        // 為每個選取的時段建立預約記錄
        const reservationPromises = this.selectedSlots.map(
          async (slot, index) => {
            const docId = (currentCount + index + 1).toString();

            const reservationData = {
              reserve_date: slot.date,
              reserve_time: slot.hour.toString(),
              reserve_user: auth.currentUser.displayName,
              reserve_venue: this.venueName || this.selectedVenue,
              reserve_price: this.pricePerHour,
              order_date: new Date().toISOString().split("T")[0], // 新增訂單日期
              payment_status: this.payment_status,
              cancel_status: this.cancel_status,
              expired_status: this.expired_status,
              payment_accunt_last_five_number:
                this.payment_accunt_last_five_number,
            };

            // 使用 setDoc 新增文件
            return setDoc(doc(db, "reservations", docId), reservationData);
          }
        );

        // 等待所有預約完成
        await Promise.all(reservationPromises);

        toast.success("預約成功！", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
        this.selectedSlots = [];
        this.acceptedTerms = false;
        await this.fetchBookedSlots();
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.$router.push("/search");
      } catch (error) {
        toast.error("預約失敗，請稍後再試", {
          autoClose: 1000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    },
    startDrag(day, hour) {
    if (!this.selectedVenue) {
      this.showModal = true;
      return;
    }
    
    if (this.isBooked(day.date, hour)) {
      return;
    }

    // 檢查是否已選中
    const isCurrentlySelected = this.selectedSlots.some(
      slot => slot.day === day.dayName && slot.hour === hour
    );

    // 如果是單擊（不是拖曳），直接切換選擇狀態
    setTimeout(() => {
      if (!this.isDragging) {
        if (isCurrentlySelected) {
          // 取消選擇
          this.selectedSlots = this.selectedSlots.filter(
            slot => !(slot.day === day.dayName && slot.hour === hour)
          );
        } else {
          // 添加選擇
          this.selectedSlots.push({
            day: day.dayName,
            hour: hour,
            date: day.date
          });
        }
      }
    }, 200); // 200ms 延遲來區分點擊和拖曳

    this.isDragging = true;
    this.dragStart = { day, hour };
  },

    // 拖曳中
    handleDrag(day, hour) {
      if (this.isDragging) {
        this.dragEnd = { day, hour };
        this.updateSelection();
      }
    },

    // 結束拖曳
    endDrag() {
      this.isDragging = false;
      this.dragStart = null;
      this.dragEnd = null;
    },

    // 更新選擇的時段
  updateSelection() {
    if (!this.dragStart || !this.dragEnd) return;

    // 找出開始和結束日期的索引
    const startDayIndex = this.weekDays.findIndex(d => d.dayName === this.dragStart.day.dayName);
    const endDayIndex = this.weekDays.findIndex(d => d.dayName === this.dragEnd.day.dayName);

    // 確保有正確的順序
    const [minDayIndex, maxDayIndex] = [startDayIndex, endDayIndex].sort((a, b) => a - b);
    const [minHour, maxHour] = [this.dragStart.hour, this.dragEnd.hour].sort((a, b) => a - b);

    // 清空之前的選擇
    this.selectedSlots = [];

    // 添加所有在範圍內的時段
    for (let dayIndex = minDayIndex; dayIndex <= maxDayIndex; dayIndex++) {
      const currentDay = this.weekDays[dayIndex];
      for (let hour = minHour; hour <= maxHour; hour++) {
        // 檢查是否已被預約
        if (!this.isBooked(currentDay.date, hour)) {
          this.selectedSlots.push({
            day: currentDay.dayName,
            hour: hour,
            date: currentDay.date
          });
        }
      }
    }
  },
  },
  watch: {
    // 監聽場地查詢頁面vuex傳入場地
    "$store.state.selectedVenueName": {
      immediate: true,
      handler(newVenue) {
        if (newVenue && newVenue !== this.selectedVenue) {
          this.selectedVenue = newVenue;
          this.fetchBookedSlots();
        }
      },
    },
    selectedVenue: {
      immediate: true,
      async handler(newVenue) {
        console.log("場地變更:", newVenue);
        this.selectedSlots = []; // 清空已選擇的時段
        if (newVenue) {
          // 獲取新場地的價格
          await this.fetchVenuePrice(newVenue);
          // 確保在選擇場地後立即更新預約狀態
          this.$nextTick(() => {
            this.fetchBookedSlots();
          });
        } else {
          this.bookedSlots = {};
          this.pricePerHour = 0; // 重置價格
        }
      },
    },
    "$store.state.selectedVenueName": {
      immediate: true,
      async handler(newVenue) {
        if (newVenue && newVenue !== this.selectedVenue) {
          this.selectedVenue = newVenue;
          await this.fetchVenuePrice(newVenue);
          this.fetchBookedSlots();
        }
      },
    },
    selectedDate() {
      this.updateWeekDays();
      if (this.selectedVenue) {
        this.fetchBookedSlots();
      }
    },
  },
};
</script>

<style scoped>
/* 防止整個表格的文字被選中 */
.time-table {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;   /* Safari */
  -khtml-user-select: none;    /* Konqueror HTML */
  -moz-user-select: none;      /* Firefox */
  -ms-user-select: none;       /* Internet Explorer/Edge */
  user-select: none;           /* Non-prefixed version */
}

/* 防止表格單元格的文字被選中 */
.time-table td,
.time-table th,
.time-table button {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
}

/* 移除最大高度限制，改為自適應高度 */
.time-table {
  width: 100%;
  height: auto;
}

/* 漸變動畫 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

.time-table {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 平板和手機版的滾動條樣式 */
@media (max-width: 1024px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
  }

  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }

  .overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb {
    background-color: rgba(59, 130, 246, 0.5);
    border-radius: 3px;
  }
}

/* 避免手機版按鈕文字換行 */
.time-table button {
  white-space: nowrap;
}
</style>
