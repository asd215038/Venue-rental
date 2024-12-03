<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- 標題 -->
      <h2 class="text-2xl font-bold text-blue-500 mb-6">
        {{ actionIsEdit ? '編輯場地' : '新增場地' }}
      </h2>

      <!-- 表單 -->
      <form @submit.prevent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- 場地名稱 -->
          <div class="form-group">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              場地名稱
            </label>
            <input type="text" v-model="venue.venues_name"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入場地名稱" />
          </div>

          <!-- 每小時費用 -->
          <div class="form-group">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              每小時費用
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input type="number" v-model="venue.price_per_hour"
                class="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入費用" />
            </div>
          </div>

          <!-- 容納人數 -->
          <div class="form-group md:col-span-2">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              容納人數
            </label>
            <input type="number" v-model="venue.capacity"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入容納人數" />
          </div>
        </div>
        <!-- 場地類別 -->
        <div class="form-group mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            場地類別
          </label>
          <select v-model="venue.category"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">請選擇場地類別</option>
            <option value="籃球場">籃球場</option>
            <option value="羽球場">羽球場</option>
          </select>

        <!-- 提交按鈕 -->
        <div class="flex justify-end space-x-4">
          <button type="button" @click="$router.push('/manage/venue')"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button v-if="actionIsEdit" type="submit" @click="openEditModal(venue.venueId)"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            確認編輯
          </button>
          <button v-else type="submit" @click="addVenue"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            新增場地
          </button>
        </div>
 </div>
      </form>
    </div>


    <!-- 編輯確認 Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">確認編輯</h3>
            <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="mb-6">
            <p class="text-gray-600">確定要編輯此場地資料嗎？</p>
          </div>
          <div class="flex justify-end space-x-4">
            <button @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button @click="confirmEdit"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              確認編輯
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/config/firebaseConfig';
import { collection, getDoc, doc, setDoc, getDocs } from 'firebase/firestore';

export default {
  props: ['venueId'],

  data() {
    return {
      venue: {
        venues_name: "",
        price_per_hour: "",
        capacity: "",
        category: "",
      },
      showEditModal: false,
      actionIsEdit: this.venueId,
    };
  },

  async mounted() {
    if (this.venueId) {
      const docRef = doc(db, "venues", this.venueId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        this.venue = docSnap.data();
      } else {
        console.log("找不到該場地資料");
      }
    }
  },

  methods: {
    async getNextVenueId() {
      const querySnapshot = await getDocs(collection(db, "venues"));
      return String(querySnapshot.size + 1);
    },

    async addVenue() {
      try {
        // 獲取下一個文件ID
        const nextId = await this.getNextVenueId();

        // 使用setDoc，並指定文件ID
        const docRef = doc(db, "venues", nextId);
        await setDoc(docRef, {
          venues_name: this.venue.venues_name,
          price_per_hour: this.venue.price_per_hour,
          capacity: this.venue.capacity,
          category: this.venue.category,
        });

        console.log("場地資料已新增");
        // 新增成功後跳轉到場地列表
        this.$router.push("/manage/venue");
      } catch (error) {
        console.log(error);
      }
    },

    openEditModal() {
      this.showEditModal = true;
    },

    async confirmEdit() {
      console.log(this.venueId)
      if (this.venueId) {
        try {
          const docRef = doc(db, "venues", this.venueId);
          await setDoc(docRef, this.venue, { merge: true });
          console.log("場地資料已編輯");
          this.$router.push("/manage/venue");
        } catch (error) {
          console.error("編輯資料時發生錯誤:", error);
        }
        this.showEditModal = false;
      }
    },
  }
};
</script>