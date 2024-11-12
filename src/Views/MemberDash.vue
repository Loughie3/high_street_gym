<template>
  <div class="m-20 p-20">
    <div>Welcome Back {{ user.first_name }}</div>
    <button
      @click="logout"
      class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Log Out
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MemberDash",
  data() {
    return {
      user: {}, // Initialize as an empty object
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found.");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the request
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    logout() {
      // Remove the token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId"); // Optional: remove userId if stored
      // Redirect to the login or home page
      window.location.href = "/login";
    },
  },
  mounted() {
    // Call the fetch method when the component is mounted
    this.fetchUserData();
  },
};
</script>
