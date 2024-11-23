import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createBootstrap } from 'bootstrap-vue-next'
import router from './router'

// Import Bootstrap and BootstrapVue-next CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(createBootstrap())
app.use(router)
app.mount('#app')
