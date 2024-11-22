<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 篩選器 -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-wrap items-center gap-4">
      <select v-model="selectedVenue" class="flex-1 px-4 py-2 border rounded-lg">
        <option value="">選擇場地</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <input
          type="date"
          v-model="selectedDate"
          @change="fetchBookedSlots"
          class="flex-1 px-4 py-2 border rounded-lg"
          :min="today"
      />
    </div>

    <!-- 課表 -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-8 overflow-auto max-h-72">
      <div class="flex justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800">場地預約</h2>
        <p class="text-sm text-gray-500">選擇日期: {{ formattedSelectedDate }}</p>
      </div>

      <table class="table-auto w-full">
        <thead>
        <tr>
          <th class="px-4 py-2 border">時間</th>
          <th
              v-for="(day, index) in weekDays"
              :key="index"
              class="px-4 py-2 border text-center"
          >
            {{ day.dayName }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="hour in hours" :key="hour">
          <td class="px-4 py-2 border text-center">{{ hour }}:00 - {{ hour + 1 }}:00</td>
          <td
              v-for="(day, index) in weekDays"
              :key="index"
              :class="{
                'bg-orange-400': day.date === selectedDate,
                'bg-gray-200': day.date !== selectedDate,
              }"
              class="px-4 py-2 border text-center"
          >
            <button
                @click="toggleSelection(day.dayName, hour, day.date)"
                :disabled="isBooked(day.date, hour)"
                :class="{
                  'bg-blue-500 text-white': isSelected(day.dayName, hour),
                  'bg-gray-300': isBooked(day.date, hour),
                  'bg-transparent': !isSelected(day.dayName, hour),
                }"
                class="w-full h-full border-none cursor-pointer"
            >
              {{ isBooked(day.date, hour) ? '已預約' : (isSelected(day.dayName, hour) ? '已選' : '預約') }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 確認預約 -->
    <div v-if="selectedSlots.length > 0" class="bg-white rounded-lg shadow-md p-4 mb-8">
      <div class="mb-4">
        <h3 class="text-lg font-bold">訂單資訊</h3>
        <ul>
          <li>場地: {{ selectedVenue }}</li>
          <li>日期: {{ today }}</li>
          <li
              v-for="slot in selectedSlots"
              :key="slot.day + slot.hour"
              class="text-sm"
          >
            時段: {{ slot.date }} - {{ slot.day }} - {{ slot.hour }}:00 - {{ slot.hour + 1 }}:00 金額: NT$
            {{ pricePerHour }}
          </li>
        </ul>
        <p class="text-xl font-semibold mt-4">總金額: NT$ {{ totalAmount }}</p>
      </div>
      <!-- 使用者條款 (保持不變) -->
      <div class="mb-4 max-h-64 overflow-auto">
        <h3 class="text-lg font-bold">使用者條款</h3>
        <ul class="text-sm text-gray-700">
          <li>1. 場地零租僅提供至當日閉館前30分鐘為止。</li>
          <li>2. 借用時段包含架設及撤場時間，請自行預留足夠時間。</li>
          <li>3. 確定預約場地後，需於24小時內完成繳費，超過繳費期限系統將自動取消訂單。</li>
          <li>4. 借用開始時間前15分鐘開放報到，請至一樓櫃檯辦理報到。</li>
          <li>5. 報到完成後，請依現場工作人員提供的場地編號使用場地。</li>
          <li>6. 逾時使用15分鐘以上者，將酌收0.5小時超時費；超過30分鐘者，將酌收1小時超時費，並於超時30分鐘後進行清場。因清場產生之相關損失，需自行負責。</li>
          <li>7. 已完成繳費的訂單，如因故需取消或變更場地、時間，應於場地使用時間前四小時提出異動或取消。其餘詳細規範將依「場地使用規範」辦理，逾時恕不受理，感謝您的配合。</li>
        </ul>
      </div>
      <!-- 同意條款 -->
      <div class="flex items-center mb-4">
        <input type="checkbox" v-model="acceptedTerms" class="mr-2" />
        <label>我已閱讀並同意上述條款</label>
      </div>

      <!-- 確認按鈕 -->
      <button
          @click="submitOrder"
          :disabled="!acceptedTerms"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        確認預約
      </button>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      categories: ["籃球場", "足球場", "羽球場"], // 場地類型
      selectedVenue: "", // 選擇的場地
      selectedDate: new Date().toISOString().split("T")[0], // 默認為今天
      weekDays: [], // 動態生成的一周日期
      hours: Array.from({ length: 15 }, (_, i) => 8 + i), // 08:00 - 22:00 的時段
      selectedSlots: [], // 用戶選擇的時段
      bookedSlots: {}, // 已被預約的時段
      acceptedTerms: false, // 是否同意條款
      pricePerHour: 300, // 每小時價格
      today: new Date().toISOString().split("T")[0], // 今天的日期
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
  },
  methods: {
    // 更新一周的日期
    updateWeekDays() {
      const selectedDateObj = new Date(this.selectedDate);
      const weekDaysArray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

      this.weekDays = weekDaysArray.map((dayName, index) => {
        const date = new Date(selectedDateObj);
        date.setDate(selectedDateObj.getDate() + index - selectedDateObj.getDay());
        return {
          dayName: dayName,
          date: date.toISOString().split("T")[0],
        };
      });
    },
    // 從 Firebase 獲取已預約的時段
    async fetchBookedSlots() {
      if (!this.selectedVenue) return;
      const venueRef = collection(db, "reservations");
      const q = query(
          venueRef,
          where("venue", "==", this.selectedVenue),
          where("date", "==", this.selectedDate)
      );
      const querySnapshot = await getDocs(q);

      const slots = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const key = `${data.date}-${data.hour}`;
        slots[key] = true;
      });
      this.bookedSlots = slots;
    },
    // 檢查時段是否已被預約
    isBooked(date, hour) {
      const key = `${date}-${hour}`;
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
    submitOrder() {
      if (!this.acceptedTerms) return;
      console.log("訂單已提交:", this.selectedSlots);
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
