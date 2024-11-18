<template>
  <div class="mx-20 mt-20 p-10 h-screen flex flex-col">
    <h1 class="text-2xl font-bold mb-5">Weekly Calendar Events</h1>
    <div class="calendar-container flex-1">
      <div class="flex">
        <!-- Time Slots Column -->
        <div class="flex flex-col w-12">
          <div class="h-10"></div>
          <div
            v-for="hour in timeSlots"
            :key="hour"
            class="time-slot flex items-center justify-center text-gray-500 text-sm"
          >
            {{ hour }}
          </div>
        </div>

        <!-- Days of Week Columns -->
        <div class="flex-1 grid grid-cols-5 gap-0 border-t border-l">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="text-center font-bold py-2 border-b border-r text-sm"
          >
            {{ day }}
          </div>

          <!-- Time Slots for Each Day -->
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="flex flex-col border-r"
          >
            <div
              v-for="slot in timeSlots"
              :key="slot"
              class="time-slot relative border-b cursor-pointer hover:bg-gray-100"
            >
              <div
                v-for="event in filteredEvents(day, slot)"
                :key="event.id"
                class="absolute inset-0 bg-violet-300 text-black text-xs p-1 rounded flex flex-col justify-center items-center"
                @click="bookClass(event.id)"
              >
                <div class="font-bold">{{ event.class_name }}</div>
                <div class="font-semibold text-xs">
                  {{ event.fitness_level }}
                </div>
                <div class="font-semibold text-xs">
                  Start time:
                  <span>
                    {{ event.class_time }} - {{ event.duration }} mins</span
                  >
                </div>
                <div class="text-xs">Trainer: {{ event.trainer }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Events Message -->
    <div
      v-if="calendarData.length === 0"
      class="mt-5 text-center text-gray-500"
    >
      No events loaded
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-5 rounded shadow-lg w-1/3 text-center">
        <h2 class="text-xl font-bold text-violet-500 mb-4">Booking Error</h2>
        <p class="text-gray-700 mb-4">{{ error }}</p>
        <button
          @click="closeModal"
          class="bg-violet-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CustomCalendar",
  data() {
    return {
      calendarData: [],
      error: null,
      daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: [
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ],
      showModal: false,
    };
  },
  mounted() {
    this.fetchCalendarData();
  },
  methods: {
    async fetchCalendarData() {
      try {
        const response = await axios.get("http://localhost:3000/api/calendar");
        if (response.data && response.data.length > 0) {
          this.calendarData = response.data.map((event) => ({
            id: event.calendar_id,
            day: event.day,
            class_time: event.class_time.substring(0, 5), // Keep only HH:MM
            duration: event.duration,
            fitness_level: event.fitness_level,
            class_name: event.class_name,
            trainer: `${event.trainer_first_name} ${event.trainer_last_name}`,
          }));
        } else {
          console.warn("No calendar events found.");
          this.calendarData = [];
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching calendar data:", error);
      }
    },
    async bookClass(calendarId) {
      try {
        const confirmed = confirm("Are you sure you want to book this class?");
        if (!confirmed) return;

        const token = localStorage.getItem("authToken");
        if (!token) {
          this.error = "User not logged in. Please sign in to make a booking";
          this.showModal = true;
          return;
        }

        const response = await axios.post(
          "http://localhost:3000/api/bookClass",
          { calendarId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert(response.data.message);
        this.error = null;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // Show the modal with a specific message
          this.error = "This class is already booked.";
          this.showModal = true;
        } else {
          // Handle other errors
          this.error = error.response
            ? error.response.data.error
            : "Booking failed.";
          this.showModal = true;
        }
        console.error("Error booking class:", error);
      }
    },
    filteredEvents(day, timeSlot) {
      return this.calendarData.filter((event) => {
        const eventTime = event.class_time.substring(0, 5);
        return event.day === day && eventTime === timeSlot;
      });
    },
    closeModal() {
      this.showModal = false;
      this.error = null;
    },
  },
};
</script>

<style scoped>
.time-slot {
  height: 80px; /* Adjust this to your preferred height */
}
.calendar-container {
  max-height: calc(100vh - 200px); /* Adjust based on your footer height */
  overflow-y: auto; /* Makes it scrollable if content overflows */
}
</style>
