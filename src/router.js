import { createRouter, createWebHistory } from "vue-router";
import Home from "./Views/Home.vue"; // Adjust the path based on your project structure
import Login from "./Views/Login.vue";
import Calendar from "./Views/Calendar.vue";
import SignUp from "./Views/SignUp.vue";
import Blog from "./Views/Blog.vue";
import MemberDash from "./Views/MemberDash.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  { path: "/blog", name: "Blog", component: Blog },

  { path: "/memberDash", name: "MemberDash", component: MemberDash },

  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
