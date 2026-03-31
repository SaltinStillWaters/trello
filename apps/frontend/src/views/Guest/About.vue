<template>
  <GuestHeroSection />
  <v-container class="pt-10 pb-16" style="margin-bottom: 80px;">
    <div class="text-center mb-7">
      <h1 class="font-weight-bold" style="font-size: 3rem">
        OUR <span style="color: #075bab">STORY</span>
      </h1>
    </div>

    <v-row class="font-weight-medium">
      <v-col cols="12" md="6" class="pr-md-10">
        <p class="text-justify" style="font-size: 1.5rem">
          On December 12, 2012, The Real Estate Hometown UnitageBiz-Centre
          (REHub), a comprehensive, one-stop real estate hub was launched in
          Quezon City.
          <br />
          <br />
          This innovative property hub covers all essential real estate
          services. Our company is dedicated to handling all aspects of the
          process, including documentation and property management, to provide a
          seamless high-quality real estate experience for our clients.
        </p>
      </v-col>

      <v-col cols="12" md="6" class="pl-md-10">
        <p class="text-justify" style="font-size: 1.5rem; color: #075bab">
          At REHub, we are committed to delivering exceptional service and
          innovative solutions tailored to meet the unique needs of each client.
          Our dedicated team of professionals is here to guide you through every
          step of your real estate journey, whether you are looking to buy,
          sell, lease, or invest. We pride ourselves on our core values of
          integrity, accountability, and service commitment, ensuring that our
          clients receive the highest level of service and expertise.
        </p>
      </v-col>
    </v-row>

    <div class="text-center mb-7" style="margin-top: 120px">
      <h1 class="font-weight-bold" style="font-size: 3rem">
        VISION & <span style="color: #075bab">MISSION</span>
      </h1>
    </div>
    
    <v-row align="start" density="compact" style="margin: 0">
      <v-col cols="12" md="6" class="pa-0">
        <h1 class="font-weight-bold vision-title">Our Vision</h1>
        <p class="text-justify vision-text font-weight-medium" style="font-size: 1.5rem; color: #454545;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod,
        dolor nec gravida sollicitudin, nunc nisl sagittis sem, at laoreet
        libero ante a sem. Curabitur id dictum erat.</p>
      </v-col>
      <v-col cols="12" md="6" class="pa-0">
        <v-img src="https://picsum.photos/id/70/555/346" />
      </v-col>
    </v-row>
    <v-row align="start" density="compact" style="margin: 0">
      <v-col cols="12" md="6" class="pa-0">
        <v-img src="https://picsum.photos/id/78/555/346" />
      </v-col>
      <v-col cols="12" md="6" class="pa-0">
        <h1 class="font-weight-bold mission-title mt-4" style="color: #075bab;">Our Mission</h1>
        <p class="text-justify vision-text font-weight-medium" style="font-size: 1.5rem; color: #454545;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod,
        dolor nec gravida sollicitudin, nunc nisl sagittis sem, at laoreet
        libero ante a sem. Curabitur id dictum erat.</p>
      </v-col>

    </v-row>
  </v-container>
</template>
<script setup>
import GuestHeroSection from '@/components/Guest/Navigation/GuestHeroSection.vue';
</script>
<style scoped>
.vision-title {
  margin: 0 0 16px 0;
  margin-left: 7px;
}

.mission-title{
  margin-bottom: 16px;
  margin-left: 7px;
}
.vision-text {
  margin: 0;
}
</style>
