<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 篩選器 -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-wrap items-center gap-4">
      <select v-model="selectedCategory" class="flex-1 px-4 py-2 border rounded-lg">
        <option value="">所有類型</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <input type="date" v-model="selectedDate" class="flex-1 px-4 py-2 border rounded-lg" />
      <input type="time" v-model="selectedTime" class="flex-1 px-4 py-2 border rounded-lg" />
      <input type="number" v-model="selectedCapacity" placeholder="容納人數" class="flex-1 px-4 py-2 border rounded-lg" />
      <input type="text" v-model="searchKeyword" placeholder="搜尋關鍵字" class="flex-1 px-4 py-2 border rounded-lg" />
    </div>

    <!-- 場地卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="venue in venues" :key="venue.venueId"
        class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer" @click="openModal(venue)">
        <img :src="venue.imageUrl" alt="場地圖片" class="h-48 w-full object-cover" />
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ venue.venues_name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ venue.description || '暫無描述' }}</p>
          <p class="text-sm text-gray-800 font-medium">NT$ {{ venue.price_per_hour }}/小時</p>
          <p class="text-sm text-gray-800 font-medium">容納人數: {{ venue.capacity }}</p>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen && selectedVenue"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-bold text-gray-800 mb-2">{{ selectedVenue.venues_name }}</h3>
        <img :src="selectedVenue.imageUrl" alt="場地圖片" class="h-48 w-full object-cover mb-4" />
        <p class="text-sm text-gray-600 mb-4">{{ selectedVenue.description || '暫無描述' }}</p>
        <p class="text-sm text-gray-800 font-medium">NT$ {{ selectedVenue.price_per_hour }}/小時</p>
        <p class="text-sm text-gray-800 font-medium">容納人數: {{ selectedVenue.capacity }}</p>

        <div class="mt-4 flex justify-between">
          <button @click="goToBookingPage" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            預約
          </button>
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
            返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      venues: [],
      categories: ["籃球場", "足球場", "羽球場"], // 示例類別
      selectedCategory: "",
      selectedDate: "",
      selectedTime: "",
      selectedCapacity: "",
      searchKeyword: "",
      isModalOpen: false,  // 模態框的開關狀態
      selectedVenue: null, // 被選中的場地
    };
  },
  computed: {
    filteredVenues() {
      return this.venues.filter((venue) => {
        const matchesCategory = this.selectedCategory
          ? venue.category === this.selectedCategory
          : true;
        const matchesDateAndTime = this.selectedDate
          ? venue.availableDates.some(
            (d) =>
              d.date === this.selectedDate &&
              (!this.selectedTime || d.timeSlots.includes(this.selectedTime))
          )
          : true;
        const matchesCapacity = this.selectedCapacity
          ? venue.capacity >= this.selectedCapacity
          : true;
        const matchesKeyword = this.searchKeyword
          ? venue.name.includes(this.searchKeyword) ||
          venue.description.includes(this.searchKeyword)
          : true;

        return matchesCategory && matchesDateAndTime && matchesCapacity && matchesKeyword;
      });
    },
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
    openModal(venue) {
      this.selectedVenue = venue;
      this.isModalOpen = true;
      // 將場地名稱存入 Vuex
      this.$store.dispatch('setVenueName', venue.venues_name);
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedVenue = null;
    },
    goToBookingPage() {
      this.$router.push('/reserve');
      this.closeModal();
    }
  }
};
</script>

<style scoped>
/* 保持響應式設計 */
.grid {
  gap: 1.5rem;
}

h3 {
  font-size: 1.25rem;
}

button {
  transition: background-color 0.3s;
}
</style>
