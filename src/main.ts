import { createApp } from "vue";
import { inject } from "@vercel/analytics";
import App from "./App.vue";
import router from "./router";
import { isTauri } from "./services/codeRunner";
import "./styles.css";

if (!isTauri()) {
    inject();
}

createApp(App).use(router).mount("#app");
