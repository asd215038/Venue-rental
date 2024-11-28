<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 篩選器 -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-wrap items-center gap-4">
      <select v-model="selectedVenue" class="flex-1 px-4 py-2 border rounded-lg">
        <option value="">{{ venueName || '選擇場地' }}</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <input type="date" v-model="selectedDate" @change="fetchBookedSlots" class="flex-1 px-4 py-2 border rounded-lg"
        :min="today" />
    </div>

    <!-- 預約時間表 -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-8 overflow-auto max-h-72">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800">場地預約</h2>
        <p class="text-sm text-gray-500">選擇日期: {{ formattedSelectedDate }}</p>
      </div>

      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 border">時間</th>
            <th v-for="(day, index) in weekDays" :key="index" class="px-4 py-2 border text-center">
              {{ day.dayName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hour in hours" :key="hour">
            <td class="px-4 py-2 border text-center">{{ hour }}:00 - {{ hour + 1 }}:00</td>
            <td v-for="(day, index) in weekDays" :key="index" class="px-4 py-2 border text-center">
              <button @click="toggleSelection(day.dayName, hour, day.date)" :disabled="isBooked(day.date, hour)" :class="{
                'bg-blue-500 text-white': isSelected(day.dayName, hour),
                'bg-gray-300': isBooked(day.date, hour),
                'bg-transparent': !isSelected(day.dayName, hour),
              }" class="w-full h-full border-none cursor-pointer">
                {{ isBooked(day.date, hour) ? '已預約' : (isSelected(day.dayName, hour) ? '已選' : '預約') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 訂單資訊區域 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <!-- 訂單資訊標題和內容 -->
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">訂單資訊</h3>

        <!-- 沒有選取時的顯示 -->
        <div v-if="selectedSlots.length === 0" class="text-gray-500 text-center py-4">
          <p class="text-sm">尚未選擇任何時段</p>
          <p class="text-xs mt-1">請在上方時間表選擇您想要預約的時段</p>
        </div>

        <!-- 有選取時的顯示 -->
        <div v-else class="space-y-4">
          <div class="flex items-center text-gray-700">
            <span class="font-medium min-w-24">場地：</span>
            <span>{{ selectedVenue }}</span>
          </div>
          <div class="flex items-center text-gray-700">
            <span class="font-medium min-w-24">日期：</span>
            <span>{{ today }}</span>
          </div>

          <!-- 選取的時段列表 -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <p class="font-medium text-gray-700 mb-2">已選時段：</p>
            <div v-for="slot in selectedSlots" :key="slot.day + slot.hour"
              class="flex justify-between items-center p-2 bg-white rounded shadow-sm">
              <span class="text-sm text-gray-600">
                {{ slot.date }} - {{ slot.day }} - {{ slot.hour }}:00 - {{ slot.hour + 1 }}:00
              </span>
              <span class="text-sm font-medium text-blue-600">
                NT$ {{ pricePerHour }}
              </span>
            </div>
          </div>

          <!-- 總金額 -->
          <div class="flex justify-between items-center pt-4 border-t mt-4">
            <span class="text-lg font-medium text-gray-700">總金額</span>
            <span class="text-xl font-bold text-blue-600">NT$ {{ totalAmount }}</span>
          </div>
        </div>
      </div>

      <!-- 使用者條款 -->
      <div class="mb-6">
        <h3 class="text-lg font-bold text-gray-800 mb-3">使用者條款</h3>
        <div class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
          <ul class="text-sm text-gray-600 space-y-2">
            <li class="flex gap-2">
              <span class="font-medium">1.</span>
              <span>場地零租僅提供至當日閉館前30分鐘為止。</span>
            </li>
            <li class="flex gap-2">
              <span class="font-medium">2.</span>
              <span>借用時段包含架設及撤場時間，請自行預留足夠時間。</span>
            </li>
            <li class="flex gap-2">
              <span class="font-medium">3.</span>
              <span>確定預約場地後，需於24小時內完成繳費，超過繳費期限系統將自動取消訂單。</span>
            </li>
            <li class="flex gap-2">
              <span class="font-medium">4.</span>
              <span>借用開始時間前15分鐘開放報到，請至一樓櫃檯辦理報到。</span>
            </li>
            <li class="flex gap-2">
              <span class="font-medium">5.</span>
              <span>報到完成後，請依現場工作人員提供的場地編號使用場地。</span>
            </li>
            <li class="flex gap-2">
              <span class="font-medium">6.</span>
              <span>逾時使用15分鐘以上者，將酌收0.5小時超時費；超過30分鐘者，將酌收1小時超時費，並於超時30分鐘後進行清場。因清場產生之相關損失，需自行負責。</span>
            </li>
            <li class="flex gap-2">
              <span class="font-medium">7.</span>
              <span>已完成繳費的訂單，如因故需取消或變更場地、時間，應於場地使用時間前四小時提出異動或取消。其餘詳細規範將依「場地使用規範」辦理，逾時恕不受理，感謝您的配合。</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 同意條款 -->
      <div class="flex items-center mb-6">
        <input type="checkbox" v-model="acceptedTerms"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <label class="ml-2 text-sm text-gray-600">我已閱讀並同意上述條款</label>
      </div>

      <!-- 確認按鈕 -->
      <button @click="submitOrder" :disabled="!acceptedTerms || selectedSlots.length === 0" class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium
                 hover:bg-blue-600 transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed">
        確認預約
      </button>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc, orderBy } from "firebase/firestore";

export default {
  data() {
    return {
      categories: [], // 場地類型
      selectedVenue: "", // 選擇的場地
      selectedDate: new Date().toISOString().split("T")[0], // 默認為今天
      weekDays: [], // 動態生成的一周日期
      hours: Array.from({ length: 15 }, (_, i) => 8 + i), // 08:00 - 22:00 的時段
      selectedSlots: [], // 用戶選擇的時段
      bookedSlots: {}, // 已被預約的時段
      acceptedTerms: false, // 是否同意條款
      pricePerHour: 300, // 每小時價格
      today: new Date().toISOString().split("T")[0], // 今天的日期
      q: [],
    };
  },
  created() {
    this.updateWeekDays();
    this.fetchBookedSlots();
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
    this.$store.dispatch('cleanVenueName');
    next();
  },
  methods: {
    // 更新一周的日期
    updateWeekDays() {
      const today = new Date();

      this.weekDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        return {
          dayName: date.toLocaleDateString('zh-TW', {
            month: 'numeric',
            day: 'numeric',
            weekday: 'short'
          }),
          date: date.toISOString().split('T')[0]
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
    // 從 Firebase 獲取已預約的時段
    async fetchBookedSlots() {
      if (this.selectedVenue === "選擇場地") {
        console.log("尚未選擇場地");
        return;
      }
      try {
        const venueRef = collection(db, "reservations");
        // 只使用一個 orderBy
        const q = query(venueRef,
          orderBy('reserve_date', 'asc')  // 只按照日期排序
        );

        const querySnapshot = await getDocs(q);
        console.log("總共找到", querySnapshot.size, "筆預約紀錄");

        // 建立一個整理後的資料結構
        const organizedBookings = {};

        // 整理資料
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { reserve_date, reserve_time } = data;

          if (!organizedBookings[reserve_date]) {
            organizedBookings[reserve_date] = [];
          }

          organizedBookings[reserve_date].push(reserve_time);

          // 對每個日期的時間進行排序
          organizedBookings[reserve_date].sort((a, b) => parseInt(a) - parseInt(b));
        });

        console.log("整理後的預約資料:", organizedBookings);

        // 將整理後的資料存入 bookedSlots
        const slots = {};
        Object.entries(organizedBookings).forEach(([date, times]) => {
          times.forEach(time => {
            const key = `${date}-${time}`;
            slots[key] = true;
          });
        });

        this.bookedSlots = slots;

      } catch (error) {
        console.error("獲取預約資料時發生錯誤:", error);
      }
    },
    // 檢查時段是否已被預約
    isBooked(date, hour) {
      const key = `${date}-${hour.toString()}`;
      return this.bookedSlots[key] || false;
    },
    // 切換時段選擇
    toggleSelection(day, hour, date) {
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
        alert('請先登入再進行預約');
        this.$router.push('/login');
        return;
      }

      if (!this.acceptedTerms) {
        alert('請先同意使用者條款');
        return;
      }

      try {
        // 先獲取目前集合的文件數量
        const querySnapshot = await getDocs(collection(db, "reservations"));
        let currentCount = querySnapshot.size;

        // 為每個選取的時段建立預約記錄
        const reservationPromises = this.selectedSlots.map(async (slot, index) => {
          const docId = (currentCount + index + 1).toString();

          const reservationData = {
            reserve_date: slot.date,
            reserve_time: slot.hour.toString(),
            reserve_user: auth.currentUser.email,
            reserve_venue: this.venueName || this.selectedVenue,
            reserve_price: this.pricePerHour
          };

          // 使用 setDoc 新增文件
          return setDoc(doc(db, "reservations", docId), reservationData);
        });

        // 等待所有預約完成
        await Promise.all(reservationPromises);

        alert('預約成功！');
        this.selectedSlots = [];
        this.acceptedTerms = false;
        await this.fetchBookedSlots();

      } catch (error) {
        console.error("預約失敗:", error);
        alert('預約失敗，請稍後再試');
      }
    },
  },
  watch: {
    selectedDate() {
      this.updateWeekDays();
      this.fetchBookedSlots();
    },
    selectedVenue() {
      this.fetchBookedSlots();
    },
  },
};
</script>

<style scoped>
/* 顏色與按鈕 */
.bg-orange-400 {
  background-color: #f97316;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

button:disabled {
  opacity: 0.5;
}
</style>
