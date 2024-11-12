<template>
  <header class="w-full">
    <div
      class="hero min-h-screen w-full"
      :style="`background-image: url(${heroImage})`"
    >
      <div class="hero"></div>
      <div
        class="hero-content w-full text-neutral-content text-center flex justify-center"
      >
        <div>
          <h1 class="mb-10 text-5xl text-white font-bold">High Street Gym</h1>
          <p class="mb-10 text-xl text-white">
            Top Rated Fitness classes near you
          </p>
          <button class="btn hover:bg-violet-500 bg-violet-800 text-white">
            Join Now
          </button>
        </div>
      </div>
    </div>
  </header>
  <section class="w-full flex justify-center text-black bg-white">
    <div class="p-10 mt-10 mb-10 text-xl max-w-screen-md text-left">
      <h1 class="text-4xl font-medium mb-4">Take your Fitness Seriously!</h1>
      Discover the best fitness experience in Brisbane! At High Street Gym, we
      offer top-tier facilities, expert trainers, and a wide variety of classes
      that set the gold standard in fitness. Whether you're aiming to build
      strength, boost endurance, or find balance, our team is here to support
      you every step of the way. Join today and see why High Street Gym is the
      go-to choice for a healthier, happier you!
    </div>
  </section>
</template>

<script>
import heroImage from "../assets/images/hero.jpg"; // Import the image

export default {
  name: "Home",
  data() {
    return {
      heroImage, // Use the imported image in the component
    };
  },
};
</script>
