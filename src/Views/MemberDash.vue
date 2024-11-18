<template>
  <div
    class="min-h-screen flex items-center justify-center mt-20 bg-violet-100"
  >
    <!-- Middle Column -->
    <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
      <!-- Booked Classes Section -->
      <h1 class="text-3xl font-bold text-black mb-6 text-center">
        Membership Dashboard
      </h1>

      <!-- User Welcome -->
      <div class="text-xl text-black mb-10 text-center">
        Welcome back, <span class="font-bold">{{ user.first_name }}</span
        >!
      </div>

      <!-- Booked Classes -->
      <div>
        <h2 class="text-2xl font-semibold text-violet-800 mb-4 text-center">
          Your Booked Classes
        </h2>
        <ul class="space-y-4">
          <li
            v-for="bookedClass in bookings"
            :key="bookedClass.booking_id"
            class="p-4 border border-violet-300 rounded-lg bg-violet-100"
          >
            <div class="font-bold text-lg text-violet-900">
              {{ bookedClass.class_name }}
            </div>
            <div class="text-gray-700 mt-1">
              <span class="font-semibold">Date & Time:</span>
              {{ bookedClass.day }} at {{ bookedClass.class_time }} ({{
                bookedClass.duration
              }}
              mins)
            </div>
            <div class="text-gray-700 mt-1">
              <span class="font-semibold">Fitness Level:</span>
              {{ bookedClass.fitness_level }}
            </div>
            <div class="text-gray-700 mt-1">
              <span class="font-semibold">Trainer:</span>
              {{ bookedClass.trainer_first_name }}
              {{ bookedClass.trainer_last_name }}
            </div>
          </li>
        </ul>
        <div
          v-if="bookings.length === 0"
          class="text-gray-500 mt-5 text-center"
        >
          You have no booked classes yet. Start exploring and book your next
          class!
        </div>
      </div>

      <!-- Logout Button -->
      <div class="mt-10 text-center">
        <button
          @click="logout"
          class="bg-violet-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-all"
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
  name: "MembershipDashboard",
  data() {
    return {
      user: {
        first_name: "",
      },
      bookings: [], // Stores booked classes
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

        // Fetch user bookings
        await this.fetchUserBookings();
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    },
    async fetchUserBookings() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authToken found.");
          return;
        }

        // Fetch bookings data
        const bookingResponse = await axios.get(
          "http://localhost:3000/api/bookedClasses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        this.bookings = bookingResponse.data;
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
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
