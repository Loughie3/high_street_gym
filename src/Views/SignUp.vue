<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 p-10"
      >
        Register Today
      </h2>
      <!-- Attach the form submission to the login method with prevent default -->
      <form class="space-y-6" @submit.prevent="register">
        <div>
          <label
            for="firstName"
            class="block text-sm font-medium leading-6 text-gray-900"
            >First Name</label
          >
          <div class="mt-2">
            <input
              id="firstName"
              v-model="firstName"
              name="firstName"
              type="text"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-white ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            for="lastName"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Last Name</label
          >
          <div class="mt-2">
            <input
              id="lastName"
              v-model="lastName"
              name="lastName"
              type="text"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-white ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            for="userName"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Username</label
          >
          <div class="mt-2">
            <input
              id="userName"
              v-model="userName"
              name="userName"
              type="text"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-white ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Password</label
            >
          </div>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-white ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-violet-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign Up
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already a member?
        <a
          href="#"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Login</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      firstName: "",
      lastName: "",
      userName: "",
      userRole: "member",
      password: "",
    };
  },
  methods: {
    async register() {
      // Change method name from login to register
      try {
        const response = await axios.post(
          "http://localhost:3000/api/register",
          {
            firstName: this.firstName,
            lastName: this.lastName,
            userName: this.userName, // Ensure consistency with the backend
            userRole: this.userRole,
            password: this.password,
          }
        );
        alert("Registration successful! Please log in.");
        this.$router.push("/login"); // Redirect to login page if successful
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Try again.");
      }
    },
  },
};
</script>
