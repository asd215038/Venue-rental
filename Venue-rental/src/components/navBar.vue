<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <router-link class="navbar-brand" to="/">Home</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">場地租借</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">場地查詢</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">訂單查詢</a>
                </li>
                <!-- <li v-if="isLoggedIn" class="nav-item"> 設定僅限登入時能夠檢視 -->  
                <li class="nav-item">
                    <a class="nav-link" href="/user/manage">後臺管理</a>
                </li>
            </ul>
            <div v-if="isLoggedIn" class="userName">
                <p>使用者名稱: {{ user.displayName }}</p>
            </div>
            <router-link v-if="isLoggedIn" class="btn btn-outline-success my-2 my-sm-0" to="logout">登出</router-link>
            <router-link v-else class="btn btn-outline-success my-2 my-sm-0" to="/login">登入 / 註冊</router-link>
        </div>
    </nav>
</template>

<script>
export default {
    computed: {
        user() {
            console.log(this.$store.state.user)
            return this.$store.state.user
        },
        isLoggedIn() {
            console.log(this.$store.state.user.loggedIn)
            return this.$store.state.user.loggedIn
        }
    }
}
</script>

<style>
.userName {
    display: flex;
    align-items: center; /* 垂直置中 */
}
</style>