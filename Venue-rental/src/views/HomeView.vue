<template>
  <div class="home">

    <div style="margin: 50px;"></div>

    <Carousel></Carousel>
    
    <!-- 最新消息區塊 -->
    <div class="news-section max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl text-center text-blue-500 font-bold mb-6">最新消息</h2>
      <div class="news-list space-y-4">
        <div v-for="news in displayedNews" 
             :key="news.id" 
             class="news-item flex items-center justify-between border-b pb-4">
          <div class="flex items-center">
            <span class="text-teal-400 mr-4">📢</span>
            <span class="mr-2">{{ formatDate(news.date) }}</span>
            <span>{{ news.content }}</span>
          </div>
          <span class="text-gray-500">{{ formatDate(news.publishDate) }}</span>
        </div>
      </div>

      <!-- 展開/收合按鈕 - 只有當總新聞數量大於 5 時才顯示 -->
      <div v-if="allNewsItems.length > 5" class="text-end mt-6">
        <button 
          @click="toggleExpand"
          class="px-4 py-2 underline text-blue-400"
        >
          {{ isExpanded ? '收合' : '看更多...' }}
        </button>
      </div>

      <!-- 分頁控制 - 只在展開且總數超過10筆時顯示 -->
      <div v-if="isExpanded && allNewsItems.length > 10" 
           class="flex justify-center items-center mt-6 space-x-2">
        <!-- 上一頁按鈕 -->
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border"
          :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'"
        >
          <span class="text-sm">上一頁</span>
        </button>
        
        <!-- 頁碼按鈕 -->
        <div class="flex space-x-1">
          <button 
            v-for="pageNum in displayedPageNumbers" 
            :key="pageNum"
            @click="changePage(pageNum)"
            class="px-3 py-1 rounded border text-sm"
            :class="currentPage === pageNum ? 'bg-blue-400 text-white' : 'bg-white hover:bg-gray-50'"
          >
            {{ pageNum }}
          </button>
        </div>

        <!-- 下一頁按鈕 -->
        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border"
          :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'"
        >
          <span class="text-sm">下一頁</span>
        </button>
      </div>
    </div>

    <!-- 場館簡介區塊 -->
    <div class="intro-section max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl text-center text-blue-500 font-bold mb-6">場館簡介</h2>
      <div class="flex flex-col md:flex-row gap-6 items-center">
        <div class="md:w-1/2">
          <img src="@/assets/images/badminton1.jpeg" alt="場館照片" class="rounded-lg shadow-lg w-full">
        </div>
        <div class="md:w-1/2 space-y-4">
          <p>歡迎來到我們的運動場地租借平台！</p>
          <p>我們的場地擁有專業的羽毛球、籃球和排球場，環境舒適，設施完善，</p>
          <p>無論您是初學者還是專業運動員，都能在這裡得到愉悅的運動樂趣。</p>
          <p>我們提供靈活的預訂服務，讓您輕鬆安排練習時間，隨時挑戰自我、增強體能。</p>
          <p class="font-bold">來加入我們，讓運動點燃您的活力！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from "@/components/carousel.vue"
import { db } from '@/config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default {
  name: 'HomeView',
  
  data() {
    return {
      allNewsItems: [], // 儲存所有的新聞項目
      isExpanded: false, // 控制是否展開顯示更多
      currentPage: 1, // 當前頁碼
      itemsPerPage: 10, // 每頁顯示的數量
    }
  },

  computed: {
    displayedNews() {
      if (!this.isExpanded) {
        // 未展開時顯示前5筆
        return this.allNewsItems.slice(0, 5);
      }
      
      // 展開後根據頁碼顯示對應的新聞
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allNewsItems.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.allNewsItems.length / this.itemsPerPage);
    },

    // 顯示的頁碼範圍（最多顯示5個頁碼）
    displayedPageNumbers() {
      const total = this.totalPages;
      const current = this.currentPage;
      const delta = 2; // 當前頁前後顯示的頁數
      
      let start = Math.max(1, current - delta);
      let end = Math.min(total, current + delta);
      
      // 調整起始和結束頁碼，確保總是顯示5個頁碼（如果有的話）
      const displayCount = 5;
      if (end - start + 1 < Math.min(displayCount, total)) {
        if (current <= delta) {
          // 在開始部分
          end = Math.min(displayCount, total);
        } else if (current >= total - delta) {
          // 在結束部分
          start = Math.max(1, total - displayCount + 1);
        }
      }
      
      // 生成頁碼數組
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },

    user() {
      return this.$store.state.user
    },
    
    isLoggedIn() {
      return this.$store.state.user.loggedIn
    }
  },

  watch: {
    isExpanded(newValue) {
      if (!newValue) {
        // 收合時重置頁碼
        this.currentPage = 1;
      }
    }
  },

  mounted() {
    this.getNewsItems();
  },

  methods: {
    async getNewsItems() {
      try {
        const querySnapshot = await getDocs(collection(db, "news"));
        this.allNewsItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // 排序：依據發布日期降序排列（最新的在前）
        this.allNewsItems.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      } catch (error) {
        console.error("獲取公告資料時發生錯誤:", error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    },

    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        // 滾動到新聞列表頂部
        this.$el.querySelector('.news-section').scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  components: {
    Carousel
  }
}
</script>

<style scoped>
.news-item:last-child {
  border-bottom: none;
}

/* 按鈕樣式 */
button {
  transition: all 0.2s ease-in-out;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:disabled {
  cursor: not-allowed;
}

/* 分頁按鈕額外樣式 */
.page-button {
  min-width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>