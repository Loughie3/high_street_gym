<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 p-10"
      >
        Sign into your account
      </h2>
      <!-- Attach the form submission to the login method with prevent default -->
      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label
            for="username"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Username</label
          >
          <div class="mt-2">
            <input
              id="username"
              v-model="username"
              name="username"
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
            Sign in
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        <a
          href="/signup"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Sign Up</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          username: this.username,
          password: this.password,
        });
        const { token, role } = response.data;

        // Store the token and role in local storage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user_role", role);

        // Redirect based on role
        if (role === "admin") {
          this.$router.push("/adminDash");
        } else {
          this.$router.push("/memberDash");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Invalid credentials");
      }
    },
  },
};
</script>
