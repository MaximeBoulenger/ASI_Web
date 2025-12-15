import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vSelect from 'vue-select';

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const app = createApp(App).component('v-select', vSelect);

app.use(router);

app.mount('#app');
