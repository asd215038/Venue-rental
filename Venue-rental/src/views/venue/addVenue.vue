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
        <!-- 場地圖片 -->
        <div class="form-group md:col-span-2">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            場地圖片
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div class="space-y-1 text-center">
              <div v-if="imagePreview" class="mb-4">
                <img :src="imagePreview" alt="Preview" class="mx-auto h-32 w-auto" />
              </div>
              <div class="flex text-sm text-gray-600">
                <label
                  class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>上傳圖片</span>
                  <input type="file" class="sr-only" @change="handleFileUpload" accept="image/*">
                </label>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              <div v-if="uploadProgress > 0" class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按鈕 -->
        <div class="form-group mb-6">
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

    <!-- 編輯確認 Modal -->
    <div v-if="showFileUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900">提示</h3>
            <button @click="showFileUploadModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          <div class="mb-6">
            <p class="text-gray-600">{{ modalMessage }}</p>
          </div>
          <div class="flex justify-end space-x-4">
            <button @click="showFileUploadModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              關閉
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
import { googleConfig } from '@/config/googleConfig';

export default {
  props: ['venueId'],

  data() {
    return {
      venue: {
        venues_name: "",
        price_per_hour: "",
        capacity: "",
      },
      showEditModal: false,
      actionIsEdit: this.venueId,
      imageFile: null,
      imagePreview: null,
      uploadProgress: 0,
      imageUrl: null,
      // 新增 Google API 相關狀態
      gapiInited: false,
      tokenClient: null,
      showFileUploadModal: false,
      modalMessage: '',
    };
  },

  async mounted() {
    // 載入 Google API
    this.loadGoogleAPI();

    if (this.venueId) {
      const docRef = doc(db, "venues", this.venueId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        this.venue = docSnap.data();
        if (this.venue.image_url) {
          this.imagePreview = this.venue.image_url;
        }
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

    async handleFileUpload(event) {
      try {
        const file = event.target.files[0];
        if (!file) return;

        // 預覽圖片
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);

        // 上傳圖片
        await this.uploadImage(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        this.showFileUploadModalWithMessage('上傳圖片時發生錯誤，請稍後再試。');
      }
    },


    async addVenue() {
      try {
        const nextId = await this.getNextVenueId();
        const docRef = doc(db, "venues", nextId);
        await setDoc(docRef, {
          ...this.venue,
          image_url: this.imageUrl, // 加入圖片 URL
        });

        console.log("場地資料已新增");
        this.$router.push("/manage/venue");
      } catch (error) {
        console.log(error);
      }
    },

    openEditModal() {
      this.showEditModal = true;
    },

    async confirmEdit() {
      if (this.venueId) {
        try {
          const docRef = doc(db, "venues", this.venueId);
          await setDoc(docRef, {
            ...this.venue,
            image_url: this.imageUrl
          }, { merge: true });
          console.log("場地資料已編輯");
          this.$router.push("/manage/venue");
        } catch (error) {
          console.error("編輯資料時發生錯誤:", error);
        }
        this.showEditModal = false;
      }
    },

    // 載入 Google API
    loadGoogleAPI() {
      const script = document.createElement('script');
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        gapi.load('client', this.initializeGapiClient);
      };
      document.body.appendChild(script);
    },

    // 初始化 Google API 客戶端
    async initializeGapiClient() {
      try {
        await gapi.client.init({
          apiKey: googleConfig.apiKey,
          discoveryDocs: googleConfig.discoveryDocs,
        });
        this.gapiInited = true;
        this.createTokenClient();
      } catch (error) {
        console.error('Error initializing GAPI client:', error);
      }
    },

    // 創建 Token 客戶端
    createTokenClient() {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: googleConfig.clientId,
        scope: googleConfig.scope,
        callback: '', // 將在上傳時設定
      });
    },

    // 修改上傳圖片方法
    async uploadImage(file) {
      try {
        // 獲取授權
        await this.getAccessToken();

        const metadata = {
          name: file.name,
          mimeType: file.type,
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        // 顯示上傳進度
        this.uploadProgress = 0;

        const response = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
          {
            method: 'POST',
            headers: new Headers({
              'Authorization': 'Bearer ' + gapi.client.getToken().access_token
            }),
            body: form
          }
        );

        if (response.ok) {
          const result = await response.json();
          this.imageUrl = `https://drive.google.com/uc?id=${result.id}`;
          this.uploadProgress = 100;
          return result;
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        this.uploadProgress = 0;
        throw error;
      }
    },

    // 獲取存取權杖
    async getAccessToken() {
      return new Promise((resolve, reject) => {
        try {
          this.tokenClient.callback = async (resp) => {
            if (resp.error) {
              reject(resp);
            }
            resolve(resp);
          };
          if (gapi.client.getToken() === null) {
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
          } else {
            this.tokenClient.requestAccessToken({ prompt: '' });
          }
        } catch (err) {
          reject(err);
        }
      });
    },

    showFileUploadModalWithMessage(message) {
      this.modalMessage = message;
      this.showFileUploadModal = true;
    },
  }
};
</script>