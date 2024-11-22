<template>
  <div class="home">
    <Carousel></Carousel>
    
    <!-- 最新消息區塊 -->
    <div class="news-section max-w-4xl mx-auto px-4 py-8">
      <h2 class="text-2xl text-center text-blue-500 font-bold mb-6">最新消息</h2>
      <div class="news-list space-y-4">
        <div v-for="news in newsItems" :key="news.id" class="news-item flex items-center justify-between border-b pb-4">
          <div class="flex items-center">
            <span class="text-teal-400 mr-4">📢</span>
            <span class="mr-2">{{ news.date }}</span>
            <span>{{ news.content }}</span>
          </div>
          <span class="text-gray-500">{{ news.publishDate }}</span>
        </div>
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

export default {
  name: 'HomeView',
  
  data() {
    return {
      newsItems: [
        {
          id: 1,
          date: '10/31',
          content: '康芮颱風停班課，休館一天.',
          publishDate: '2024-10-30'
        },
        {
          id: 2,
          date: '10/27',
          content: '萬聖派對，當日穿著橘色衣服可折抵20元.',
          publishDate: '2024-10-15'
        },
        {
          id: 3,
          date: '10/15',
          content: '羽球聯誼賽，歡迎報名參加.',
          publishDate: '2024-09-30'
        },
        {
          id: 4,
          date: '10/02',
          content: '運動場地維修，休館一天.',
          publishDate: '2024-09-28'
        }
      ]
    }
  },

  computed: {
    user() {
      console.log(this.$store.state.user)
      return this.$store.state.user
    },
    isLoggedIn() {
      console.log(this.$store.state.user.loggedIn)
      return this.$store.state.user.loggedIn
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
</style>