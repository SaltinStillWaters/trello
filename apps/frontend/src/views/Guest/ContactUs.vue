<template>
  <GuestHeroSection />
  <section class="contact-section">

    <!-- House BG decoration -->
    <img :src="houseBg" alt="" aria-hidden="true" class="house-bg d-none d-md-block" />

    <v-container fluid class="py-8 py-md-12 px-4 px-sm-8 px-md-16 px-lg-12" style="max-width: 1400px; margin: 0 auto;">
      <v-row align="start" class="contact-content">

        <!-- LEFT: Heading + subtext -->
        <v-col cols="12" md="6">
          <h1 class="contact-heading">
            <span class="text-dark">Your Property</span>,
            <br />
            <span class="text-primary-blue">Your next move!</span>
          </h1>
          <p class="contact-subtext">Helping you take the next step in your Properties.</p>
        </v-col>

        <!-- RIGHT: Form -->
        <v-col cols="12" md="6">
          <v-form ref="formRef" @submit.prevent="submitForm">
            <v-row >
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.name" label="Name" variant="underlined" density="compact" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.email" label="Email" variant="underlined" density="compact" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.phone" label="Phone Number" variant="underlined" density="compact" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="form.purpose" :items="purposeOptions" label="Purpose" variant="underlined" density="compact" />
              </v-col>
              <v-col cols="12">
                <v-select v-model="form.message" :items="messageOptions" label="Message" variant="outlined" rounded="lg" density="compact" />
              </v-col>
              <v-col cols="12">
                <v-checkbox v-model="form.consent" color="primary" class="align-start" hide-details>
                  <template #label>
                    <span class="text-body-2">
                      I hereby provide my consent to receive SMS notifications, alerts, and occasional marketing communications from REHub Real Estate Inc.
                    </span>
                  </template>
                </v-checkbox>
                <p class="text-body-2 text-grey-darken-1 mt-2 ml-10">
                  By agreeing to this, I understand that I will be kept informed about important updates, reminders, and promotional offers related to the events and services provided by the company.
                </p>
              </v-col>
              <v-col cols="12" class="d-flex justify-center">
                <v-btn type="submit" color="primary" size="default" rounded="lg" min-width="140">
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>

      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import GuestHeroSection from '@/components/Guest/Navigation/GuestHeroSection.vue';
import houseBg from '@/assets/Guest/house_bg.svg';

const purposeOptions = ['Buy', 'Sell', 'Rent', 'Inquire']

const messageOptions = [
  'I am interested in buying a property',
  'I am interested in renting a property',
  'I am interested in selling a property',
]

const formRef = ref(null)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  purpose: null,
  message: '',
  consent: false,
})

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  console.log(form)
}
</script>

<style scoped>
.contact-section {
  min-height: 90vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.house-bg {
  position: absolute;
  bottom: -50px;
  left: -120px;
  width: 550px;
  pointer-events: none;
  z-index: 0;
}

.contact-content {
  position: relative;
  z-index: 1;
}

.contact-heading {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 12px;
}

.text-dark {
  color: #091638;
}

.text-primary-blue {
  color: #003CC7;
}

.contact-subtext {
  font-size: 1.25rem;
  color: #404040;
  margin-top: 16px;
  width: 70%;
}
</style>
