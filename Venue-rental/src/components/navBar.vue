<template>
  <nav class="navbar navbar-expand-lg navbar-light custom-bg">
    <font-awesome-icon :icon="['fas', 'person-running']" size="2xl" style="color: #FFD43B; margin-right: 20px;" />
        <router-link class="navbar-brand" to="/">Playground</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="#" active-class="font-weight-bold">場地租借</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="#" active-class="font-weight-bold">場地查詢</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="#" active-class="font-weight-bold">訂單查詢</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/manage" active-class="font-weight-bold">後臺管理</router-link>
        </li>
      </ul>

      <div class="navbar-nav ml-auto">
        <router-link class="nav-link btn btn-outline-primary mr-2" to="/">首頁</router-link>
        <div v-if="isLoggedIn" class="userName mr-2">
          <p>{{ user.displayName }}</p>
        </div>
        <router-link v-if="isLoggedIn" class="btn btn-outline-success my-2 my-sm-0" to="logout">登出</router-link>
        <router-link v-else class="btn btn-outline-success my-2 my-sm-0" to="/login">登入 / 註冊</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
    isLoggedIn() {
      return this.$store.state.user.loggedIn;
    }
  }
};
</script>

<style>
.custom-bg {
  background-color: #39B3E3 !important;
}
.userName {
  display: flex;
  align-items: center;
}
.font-weight-bold {
  font-weight: bold;
}
</style>
