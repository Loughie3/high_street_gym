<template>
  <div class="m-20 p-10 h-screen">
    <h1>Calendar Events</h1>
    <vue-cal
      hide-view-selector
      hide-title-bar
      view="week"
      :time-cell-height="110"
      hide-weekends
      :time-from="8 * 60"
      :time-to="19 * 60"
      :disable-views="['years', 'year', 'month', 'day']"
      :events="calendarData"
      :editable-events="{
        title: false,
        drag: false,
        resize: false,
        delete: false,
        create: false,
      }"
    >
    </vue-cal>
  </div>
</template>

<script>
import axios from "axios";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  name: "Calendar",
  components: {
    VueCal,
  },
  data() {
    return {
      // Define the events array here to bind to the Vue Cal
      calendarData: [
        {
          start: "2024-11-13 08:00", // Use ISO date format
          end: "2024-11-13 9:00",
          title: "Pilates",
          content: " Beginner <p>Trainer</p>",
          class: "blue-event",
          deletable: false,
          resizable: false,
          draggable: false,
        },
      ],
    };
  },
};
</script>

<style>
.vuecal {
  font-family: Arial, sans-serif;
}
</style>
