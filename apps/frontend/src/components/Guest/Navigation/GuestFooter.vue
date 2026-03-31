<template>
  <v-footer
    color="#075BAB"
    class="text-caption text-white d-flex flex-column justify-space-between px-6 px-sm-12 py-6">

    <!-- Logo and Button -->
    <div class="d-flex justify-space-between align-center w-100 py-4">
      <img :src="logo" alt="logo" width="145" height="80" />
      <v-btn class="rounded-xl inquire-btn px-5" to="/contact-us">Inquire</v-btn>
    </div>

    <!-- Divider -->
    <v-divider :thickness="1" color="white" class="pa-1" style="width: 100%" />

    <!-- Contacts + Pages -->
    <v-row class="w-100 mt-2" no-gutters>

      <!-- Contact us -->
      <v-col cols="12" sm="6" class="mb-6 mb-sm-0">
        <p class="font-weight-bold mb-3">Contact us</p>
        <ul class="no-bullets">
          <li class="d-flex align-center ga-2 mb-2">
            <v-img :src="facebook" width="30" height="30" style="flex: 0 0 30px" />
            <a :href="facebook_link" class="links text-truncate">{{ facebook_link }}</a>
          </li>
          <li class="d-flex align-center ga-2 mb-2">
            <v-img :src="tiktok" width="30" height="30" style="flex: 0 0 30px" />
            <a :href="tiktok_link" class="links text-truncate">{{ tiktok_link }}</a>
          </li>
          <li class="d-flex align-center ga-2 mb-2">
            <v-img :src="website" width="30" height="30" style="flex: 0 0 30px" />
            <a :href="website_link" class="links text-truncate">{{ website_link }}</a>
          </li>
          <li class="d-flex align-center ga-2">
            <v-img :src="contact_no" width="30" height="30" style="flex: 0 0 30px" />
            <a :href="contact_number" class="links">{{ contact_number }}</a>
          </li>
        </ul>
        <p class="font-weight-bold mt-6 mb-2">Address</p>
        <span>60 Sct. Chuatoco St., Quezon City, 1103<br />Metro Manila</span>
      </v-col>

      <!-- Pages + Copyright -->
      <v-col cols="12" sm="6" class="d-flex flex-column justify-space-between">
        <div>
          <p class="font-weight-bold mb-3">Pages</p>
          <ul class="no-bullets">
            <li v-for="(page, index) in pages" :key="index" class="mb-2">
              <router-link :to="page.to" class="links text-decoration-none">{{ page.name }}</router-link>
            </li>
          </ul>
        </div>
        <p class="text-caption mt-6">
          &copy; {{ new Date().getFullYear() }} — Copyright. &nbsp;{{ version }}
        </p>
      </v-col>

    </v-row>

    <!-- Scroll to top -->
    <v-btn
      @click="scrolltoTop"
      icon="mdi-arrow-up"
      style="position: absolute; bottom: 16px; right: 24px" />

  </v-footer>
</template>

<script setup>
import version from "@/utils/version";
import logo from "@/assets/logo-white.png";
import { ref } from "vue";
import facebook from "@/assets/Socials/facebook.svg";
import tiktok from "@/assets/Socials/tiktok.svg";
import website from "@/assets/Socials/website.svg";
import contact_no from "@/assets/Socials/contact_no.svg";

const facebook_link = ref("www.facebook.com/rehubrealestatehubinc");
const tiktok_link = ref("www.tiktok.com/@rehubrealestate");
const website_link = ref("www.rehubrealestate.com");
const contact_number = ref("+63 997 602 2877");

const scrolltoTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const pages = [
  { name: "Properties", to: "/properties" },
  { name: "About Us", to: "/about" },
  { name: "Inquire Now", to: "/contact-us" },
  { name: "Favorites", to: "/favorites" },
];
</script>

<style scoped>
.inquire-btn {
  color: #075bab;
}

.v-divider {
  opacity: 1 !important;
}

.links {
  color: white;
}

.no-bullets {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
</style>
