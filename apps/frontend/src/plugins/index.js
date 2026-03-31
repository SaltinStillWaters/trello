/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'
import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'; // Import default theme CSS

export function registerPlugins (app) {
  app
    .use(Toast)
    .use(vuetify)
    .use(router)
}