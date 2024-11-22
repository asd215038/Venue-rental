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
      <button @click="resetFilters" class="px-4 py-2 bg-gray-200 rounded-lg">
        重置篩選
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="isLoading" class="text-center py-8">
      載入中...
    </div>

    <!-- 無結果狀態 -->
    <div v-else-if="displayVenues.length === 0" class="text-center py-8">
      查無符合條件的場地
    </div>

    <!-- 場地卡片 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="venue in displayVenues" :key="venue.venueId"
        class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer" @click="openModal(venue)">
        <img :src="'/src/assets/images/venue/'+venue.imageUrl" alt="場地圖片" class="h-48 w-full object-cover" />
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="text-lg font-bold text-gray-800 mb-2">{{ venue.venues_name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ venue.description || '暫無描述' }}</p>
          <p class="text-sm text-gray-800 font-medium">NT$ {{ venue.price_per_hour }}/小時</p>
          <p class="text-sm text-gray-800 font-medium">容納人數: {{ venue.capacity }}</p>
        </div>
      </div>
    </div>

    <!-- 場地詳細資訊模態框 -->
    <div v-if="isModalOpen && selectedVenue"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-bold text-gray-800 mb-2">{{ selectedVenue.venues_name }}</h3>
        <img :src="'/src/assets/images/venue/'+selectedVenue.imageUrl" alt="場地圖片" class="h-48 w-full object-cover mb-4" />
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
      // Venue-related data
      venues: [], // All venues from Firebase
      categories: [], // Unique venue categories

      // Filter inputs
      selectedCategory: "",
      selectedDate: "",
      selectedTime: "",
      selectedCapacity: null,
      searchKeyword: "",

      // Filtered results and modal state
      filteredVenues: [],
      isModalOpen: false,
      selectedVenue: null,

      // Additional state for better UX
      isLoading: false,
      noResultsFound: false
    };
  },

  computed: {
    // Determine which venues to display
    displayVenues() {
      // If filtered venues exist, show them
      // Otherwise, show all venues
      return this.filteredVenues.length > 0
        ? this.filteredVenues
        : this.venues;
    }
  },

  watch: {
    // Watch all filter inputs and trigger filtering
    selectedCategory: 'filterVenues',
    selectedDate: 'filterVenues',
    selectedTime: 'filterVenues',
    selectedCapacity: 'filterVenues',
    searchKeyword: 'filterVenues',
    venues: {
      handler: 'filterVenues',
      immediate: true
    }
  },

  mounted() {
    this.fetchVenues();
  },

  methods: {
    async fetchVenues() {
      // Set loading state
      this.isLoading = true;

      try {
        // Fetch venues from Firestore
        const querySnapshot = await getDocs(collection(db, "venues"));

        // Transform firestore docs to array of venues
        const allVenues = querySnapshot.docs.map(doc => ({
          venueId: doc.id,
          ...doc.data()
        }));

        // Update venues
        this.venues = allVenues;

        // Extract unique categories
        this.categories = [
          ...new Set(allVenues.map(venue => venue.category).filter(Boolean))
        ];

        console.log(this.venues[0].imageUrl)
        
        // Initial filtering
        this.filterVenues();
      } catch (error) {
        console.error("Error fetching venues:", error);
        // Optionally show error message to user
      } finally {
        this.isLoading = false;
      }
    },

    filterVenues() {
      // Ensure venues are loaded
      if (!this.venues.length) return;

      // Filter venues based on multiple criteria
      this.filteredVenues = this.venues.filter(venue => {
        // Category filter
        const categoryMatch = !this.selectedCategory ||
          venue.category === this.selectedCategory;

        // Capacity filter (convert to number and handle null)
        const capacityMatch = !this.selectedCapacity ||
          venue.capacity >= Number(this.selectedCapacity);

        // Keyword filter (case-insensitive and handle undefined)
        const keywordMatch = !this.searchKeyword ||
          (venue.venues_name && venue.venues_name.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
          (venue.description && venue.description.toLowerCase().includes(this.searchKeyword.toLowerCase()));

        // Date and Time filter (more robust)
        const dateTimeMatch = !this.selectedDate ||
          (venue.availableDates &&
            venue.availableDates.some(
              availableDate =>
                availableDate.date === this.selectedDate &&
                (!this.selectedTime ||
                  availableDate.timeSlots.includes(this.selectedTime))
            )
          );

        // Combine all filters
        return categoryMatch &&
          capacityMatch &&
          keywordMatch &&
          dateTimeMatch;
      });

      // Update no results flag
      this.noResultsFound = this.filteredVenues.length === 0;
    },

    openModal(venue) {
      this.selectedVenue = venue;
      this.isModalOpen = true;

      // Optional: Update Vuex store with selected venue name
      if (this.$store) {
        this.$store.dispatch('setVenueName', venue.venues_name);
      }
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedVenue = null;
    },

    goToBookingPage() {
      // Navigate to booking page
      this.$router.push({
        path: '/reserve',
        query: {
          venueId: this.selectedVenue.venueId,
          venueName: this.selectedVenue.venues_name
        }
      });
      this.closeModal();
    },

    // Reset all filters
    resetFilters() {
      this.selectedCategory = "";
      this.selectedDate = "";
      this.selectedTime = "";
      this.selectedCapacity = null;
      this.searchKeyword = "";
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
