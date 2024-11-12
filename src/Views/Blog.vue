<template>
  <div class="min-h-screen bg-violet-100">
    <main class="max-w-3xl mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
      <!-- Blog Article -->
      <article>
        <h1
          class="text-5xl font-bold text-gray-800 pb-6 border-b border-gray-200"
        >
          High Street Gym Blog
        </h1>
        <h2 class="text-3xl font-semibold text-gray-700 mt-8 mb-4">
          What is Intermittent Fasting?
        </h2>
        <p class="text-gray-600 leading-relaxed mb-6">
          Intermittent fasting (IF) is an eating pattern that cycles between
          periods of fasting and eating. Unlike traditional diets, it doesn’t
          specify which foods to eat but rather focuses on when you should eat
          them. It has gained popularity due to its potential health benefits
          and simplicity.
        </p>

        <h3 class="text-2xl font-semibold text-gray-700 mb-4">
          How Does it Work?
        </h3>
        <p class="text-gray-600 leading-relaxed mb-6">
          Intermittent fasting typically involves daily 16-hour fasts or 24-hour
          fasts twice per week. Common methods include the 16/8 method (fasting
          for 16 hours, eating within an 8-hour window) and the 5:2 diet (eating
          normally for five days and limiting calories for two).
        </p>

        <h3 class="text-2xl font-semibold text-gray-700 mb-4">
          Health Benefits
        </h3>
        <ul class="list-disc list-inside text-gray-600 mb-6 ml-5">
          <li>
            <strong>Weight Loss:</strong> Fasting helps reduce calorie intake,
            which may lead to weight loss.
          </li>
          <li>
            <strong>Improved Metabolism:</strong> It may help regulate hormones
            and boost metabolism.
          </li>
          <li>
            <strong>Enhanced Brain Function:</strong> Some studies suggest it
            can reduce inflammation and support brain health.
          </li>
        </ul>

        <h3 class="text-2xl font-semibold text-gray-700 mb-4">
          Is It Right for You?
        </h3>
        <p class="text-gray-600 leading-relaxed mb-6">
          Intermittent fasting is generally safe for most healthy adults, but
          it’s essential to consult a healthcare professional before starting.
          Fasting can benefit those looking for a flexible eating pattern, but
          it may not be suitable for everyone, particularly those with specific
          medical conditions.
        </p>

        <footer
          class="text-center text-gray-500 mt-10 border-t border-gray-200 pt-4"
        >
          Published by
          <span class="font-semibold">Health & Wellness Blog</span> | November
          5, 2024
        </footer>
      </article>

      <!-- Comment Section -->
      <section class="mt-12">
        <h3 class="text-2xl font-semibold text-gray-800 mb-6">Comments</h3>

        <!-- Display Comments -->
        <div
          v-for="comment in blogData"
          :key="comment.blog_id"
          class="bg-gray-50 rounded-lg p-4 mb-4 border border-violet-900"
        >
          <h4 class="font-bold text-gray-700">{{ comment.user_name }}</h4>

          <p class="text-gray-600 mt-2">{{ comment.blog_data }}</p>
          <span class="text-xs text-gray-400">{{ comment.timestamp }}</span>
        </div>

        <!-- Comment Form -->
        <div class="bg-white p-6 rounded-lg shadow mt-6 border border-gray-200">
          <h4 class="text-xl font-semibold text-gray-800 mb-4">
            Leave a Comment
          </h4>
          <form @submit.prevent="submitComment">
            <div class="mb-4">
              <label for="comment" class="block text-gray-700 font-medium mb-2"
                >Comment</label
              >
              <textarea
                v-model="newComment.blog_data"
                id="comment"
                rows="4"
                class="w-full px-4 py-2 border border-violet-900 bg-gray-100 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-violet-900"
                placeholder="Write your comment here..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              class="bg-violet-900 text-white font-semibold px-6 py-2 rounded-lg hover:bg-violet-500 transition-colors focus:ring-2 focus:outline-none"
            >
              Post comment
            </button>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Blog",
  data() {
    return {
      blogData: [],
      currentUser: "",
      newComment: {
        blog_data: "",
      },
    };
  },
  methods: {
    async fetchBlogData() {
      try {
        const response = await axios.get("http://localhost:3000/api/blog");
        this.blogData = response.data;
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    },
    async submitComment() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to post a comment.");
          return;
        }

        const response = await axios.post(
          "http://localhost:3000/api/newComment",
          {
            blog_data: this.newComment.blog_data, // Ensure the data format matches server expectations
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the authorization header
            },
          }
        );

        alert("Comment posted!");
        this.newComment.blog_data = ""; // Clear the input field
        this.fetchBlogData(); // Refresh the comments section
      } catch (error) {
        console.error("Error submitting comment:", error);
        alert("Failed to post comment.");
      }
    },
  },
  mounted() {
    this.fetchBlogData();
  },
};
</script>
