import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vSelect from 'vue-select';

async function bootstrap() {
  // Start the MSW worker in development so DAO calls are intercepted locally.
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  const app = createApp(App).component('v-select', vSelect);

  app.use(router);

  app.mount('#app');
}

bootstrap();
