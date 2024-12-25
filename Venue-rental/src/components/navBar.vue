<template>
  <nav class="bg-sky-500 p-4 text-white">
    <div class="container mx-auto">
      <div class="flex flex-wrap items-center justify-between">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <font-awesome-icon
            :icon="['fas', 'person-running']"
            class="text-yellow-400 mr-3 text-2xl"
          />
          <router-link to="/" class="text-white text-lg font-semibold">
            Playground
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 focus:outline-none"
          @click="isOpen = !isOpen"
          aria-label="Toggle menu"
        >
          <svg
            class="h-6 w-6"
            :class="{ hidden: isOpen, block: !isOpen }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-16 6h16"
            />
          </svg>
          <svg
            class="h-6 w-6"
            :class="{ block: isOpen, hidden: !isOpen }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Navigation Links and Auth Buttons -->
        <div
          :class="[
            isOpen ? 'block' : 'hidden',
            'w-full md:flex md:items-center md:justify-between md:w-auto',
          ]"
          class="md:flex-grow"
        >
          <ul class="md:flex md:items-center md:space-x-4 pt-4 md:pt-0">
            <li class="block md:inline-block">
              <router-link
                to="/venue"
                class="block px-3 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
                active-class="font-bold underline"
              >
                場地查詢
              </router-link>
            </li>
            <li class="block md:inline-block">
              <router-link
                to="/reserve"
                class="block px-3 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
                active-class="font-bold underline"
              >
                場地租借
              </router-link>
            </li>
            <li class="block md:inline-block">
              <router-link
                to="/search"
                class="block px-3 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
                active-class="font-bold underline"
              >
                訂單查詢
              </router-link>
            </li>
            <li v-if="isAdmin" class="block md:inline-block">
              <router-link
                to="/manage"
                class="block px-3 py-2 text-white hover:text-yellow-300 rounded transition duration-150"
                active-class="font-bold underline"
              >
                後臺管理
              </router-link>
            </li>
          </ul>

          <!-- Auth Buttons -->
          <div
            class="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 mt-4 md:mt-0"
          >
            <div class="flex items-center space-x-4">
              <router-link
                to="/"
                class="px-3 py-2 text-white hover:text-yellow-300 transition duration-150 text-right"
              >
                首頁
              </router-link>

              <template v-if="isLoggedIn">
                <p class="text-white">{{ user.displayName }}</p>
                <router-link
                  to="/logout"
                  class="px-3 py-2 text-white hover:text-yellow-300 transition duration-150"
                >
                  登出
                </router-link>
              </template>

              <router-link
                v-else
                to="/login"
                class="px-3 py-2 text-white hover:text-yellow-300 transition duration-150"
              >
                登入 / 註冊
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from "vue";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "Navbar",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "user", "isAdmin"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("logOut");
    },
    closeMenu() {
      this.isOpen = false;
    },
  },
  mounted() {
    // 檢查管理員狀態
    this.$store.dispatch("checkAdminStatus");

    // 監聽路由變化，在路由變化時關閉菜單
    this.$watch(
      () => this.$route,
      () => {
        this.closeMenu();
      }
    );

    // 監聽視窗大小變化
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        this.isOpen = false;
      }
    });
  },
  beforeUnmount() {
    // 移除事件監聽器
    window.removeEventListener("resize", this.closeMenu);
  },
};
</script>
