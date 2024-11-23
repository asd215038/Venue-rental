<template>
    <div class="admin-dashboard">
      <!-- 導航欄 -->
      <nav class="bg-white shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="text-xl font-bold text-blue-500">管理後台</div>
            <div class="space-x-6">
              <router-link 
                to="/manage/user" 
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                用戶管理
              </router-link>
              <router-link 
                to="/manage/venue" 
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                場地管理
              </router-link>
              <router-link 
                to="/manage/addVenue" 
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                最新消息
              </router-link>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- 快速操作區塊 -->
      <div class="quick-actions max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-2xl text-center text-blue-500 font-bold mb-6">快速操作</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button class="action-btn bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg">
            新增預約
          </button>
          <button class="action-btn bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-lg">
            場地管理
          </button>
          <button class="action-btn bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg">
            會員管理
          </button>
          <button class="action-btn bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg">
            系統設定
          </button>
        </div>
      </div>

      <!-- 數據概覽區塊 -->
      <div class="stats-section max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-2xl text-center text-blue-500 font-bold mb-6">數據概覽</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="stat-card bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600">今日預約</p>
                <p class="text-2xl font-bold text-blue-500">{{ todayBookings }}</p>
              </div>
              <span class="text-blue-500 text-3xl">📅</span>
            </div>
          </div>
          
          <div class="stat-card bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600">本月收入</p>
                <p class="text-2xl font-bold text-teal-500">${{ monthlyRevenue }}</p>
              </div>
              <span class="text-teal-500 text-3xl">💰</span>
            </div>
          </div>
          
          <div class="stat-card bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600">活躍會員</p>
                <p class="text-2xl font-bold text-purple-500">{{ activeMembers }}</p>
              </div>
              <span class="text-purple-500 text-3xl">👥</span>
            </div>
          </div>
          
          <div class="stat-card bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600">場地使用率</p>
                <p class="text-2xl font-bold text-orange-500">{{ usageRate }}%</p>
              </div>
              <span class="text-orange-500 text-3xl">📊</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 最近活動區塊 -->
      <div class="recent-activities max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-2xl text-center text-blue-500 font-bold mb-6">最近活動</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 最新預約 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-gray-800 mb-4">最新預約</h3>
            <div class="space-y-4">
              <div v-for="booking in recentBookings" :key="booking.id" 
                   class="flex items-center justify-between border-b pb-4">
                <div>
                  <p class="font-medium">{{ booking.customerName }}</p>
                  <p class="text-sm text-gray-600">{{ booking.venue }} - {{ booking.time }}</p>
                </div>
                <span :class="getStatusClass(booking.status)">
                  {{ booking.status }}
                </span>
              </div>
            </div>
          </div>
  
          <!-- 系統通知 -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-gray-800 mb-4">系統通知</h3>
            <div class="space-y-4">
              <div v-for="notification in systemNotifications" :key="notification.id" 
                   class="flex items-center border-b pb-4">
                <span class="text-2xl mr-4">{{ notification.icon }}</span>
                <div>
                  <p class="font-medium">{{ notification.title }}</p>
                  <p class="text-sm text-gray-600">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminDashboard',
    
    data() {
      return {
        todayBookings: 24,
        monthlyRevenue: 158900,
        activeMembers: 386,
        usageRate: 78,
        
        recentBookings: [
          {
            id: 1,
            customerName: '王小明',
            venue: '羽球場 A',
            time: '2024-10-31 14:00-16:00',
            status: '已確認'
          },
          {
            id: 2,
            customerName: '李小華',
            venue: '籃球場',
            time: '2024-10-31 16:00-18:00',
            status: '待付款'
          },
          {
            id: 3,
            customerName: '張大文',
            venue: '排球場',
            time: '2024-10-31 18:00-20:00',
            status: '已完成'
          }
        ],
        
        systemNotifications: [
          {
            id: 1,
            icon: '🔔',
            title: '系統維護通知：將於今晚 23:00 進行系統更新',
            time: '10 分鐘前'
          },
          {
            id: 2,
            icon: '⚠️',
            title: '場地 B 需要維修檢查',
            time: '30 分鐘前'
          },
          {
            id: 3,
            icon: '✅',
            title: '本月財務報表已生成',
            time: '1 小時前'
          }
        ]
      }
    },
  
    methods: {
      getStatusClass(status) {
        const classes = {
          '已確認': 'text-green-500',
          '待付款': 'text-yellow-500',
          '已完成': 'text-blue-500'
        }
        return classes[status] || 'text-gray-500'
      }
    },
  
    computed: {
      user() {
        return this.$store.state.user
      },
      isAdmin() {
        return this.$store.state.user.isAdmin
      }
    }
  }
  </script>
  
  <style scoped>
  .stat-card {
    transition: all 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .action-btn {
    transition: all 0.3s ease;
  }
  
  .action-btn:hover {
    transform: translateY(-2px);
  }
  
  .recent-activities div:last-child {
    border-bottom: none;
  }
  </style>