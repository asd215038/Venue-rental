<template>
    <nav class="bg-white shadow-md">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="text-xl font-bold text-blue-500">管理後台</div>
            <div class="space-x-6">
              <router-link 
                to="/manage/user" 
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
              使用者管理
              </router-link>
              <router-link 
                to="/manage/venue" 
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                場地管理
              </router-link>
              <router-link 
                to="/manage/news" 
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                公告管理
              </router-link>
              <router-link 
                to="/manage/orders" 
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                訂單管理
              </router-link>
            </div>
          </div>
        </div>
      </nav>
</template>