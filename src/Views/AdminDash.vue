<template>
  <div
    class="min-h-screen flex items-center justify-center mt-20 bg-violet-100"
  >
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
      <h1 class="text-3xl font-bold text-black mb-6 text-center">
        Admin Dashboard
      </h1>
      <div class="text-xl text-black mb-10 text-center">
        Welcome back, <span class="font-bold">{{ user.first_name }}</span
        >!
      </div>

      <form enctype="multipart/form-data" @submit.prevent="handleUpload">
        <input
          type="file"
          name="xmlFile"
          accept=".xml"
          @change="onFileSelect"
        />
        <button
          type="submit"
          :disabled="!selectedFile"
          class="bg-violet-700 text-white px-4 py-1 rounded-lg shadow-md hover:bg-green-600 transition-all mt-4"
        >
          Upload
        </button>
      </form>

      <!-- Logout Button -->
      <div class="mt-10 text-center">
        <button
          @click="logout"
          class="bg-violet-700 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition-all"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "AdminDash",
  data() {
    return {
      selectedFile: null,
      user: {
        first_name: "",
      },
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authToken found.");
          return;
        }

        // Fetch user details
        const userResponse = await axios.get("http://localhost:3000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.user = userResponse.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    onFileSelect(event) {
      this.selectedFile = event.target.files[0];
    },
    async handleUpload() {
      const formData = new FormData();
      formData.append("xmlFile", this.selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Upload Successful: " + response.data.message);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert(
          "Upload Failed: " + (error.response?.data?.error || error.message)
        );
      }
    },
    logout() {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    },
  },
  mounted() {
    this.fetchUserData();
  },
};
</script>
