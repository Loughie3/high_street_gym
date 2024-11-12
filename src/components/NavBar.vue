<template>
  <div
    class="navbar fixed z-10 top-0 left-0 bg-violet-950 w-full p-3 text-white"
  >
    <div class="flex-1">
      <a href="/" class="text-2xl pl-5">High Street Gym</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal text-lg px-1">
        <li><a class="hover:bg-violet-500" href="/">Home</a></li>
        <li><a class="hover:bg-violet-500" href="/calendar">Calendar</a></li>
        <li v-if="isLoggedIn">
          <a class="hover:bg-violet-500" href="/memberDash">Member Dashboard</a>
        </li>
        <li><a class="hover:bg-violet-500" href="/blog">Blog</a></li>
        <li><a class="hover:bg-violet-500" href="/login">Login</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false,
    };
  },
  mounted() {
    // Initial check for token
    this.isLoggedIn = !!localStorage.getItem("token");

    // Listen for storage changes (e.g., login/logout in another tab)
    window.addEventListener("storage", this.checkLoginStatus);
  },
  beforeDestroy() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener("storage", this.checkLoginStatus);
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem("token");
    },
  },
};
</script>
