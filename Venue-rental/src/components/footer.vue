<template>
  <footer class="footer custom-footer bg-sky-500">
    <div class="text-center">
      <p>© 2024 Your Company Name. All rights reserved.</p>
      <ul class="footer-links" >
        <li><router-link to="/about">關於我們</router-link></li>
        <li><router-link to="/contact">聯絡我們</router-link></li>
        <li><router-link to="/privacy">隱私政策</router-link></li>
        <li><router-link to="/terms">使用條款</router-link></li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.custom-footer {
  color: white;
  padding: 20px 0;
  width: 100%;
}

.footer-links {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.footer-links li a {
  color: white;
  text-decoration: none;
}

.footer-links li a:hover {
  text-decoration: underline;
}
</style>