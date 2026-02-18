import { createApp } from "vue";
import { Analytics } from "@vercel/analytics/next";
import App from "./App.vue";
import router from "./router";
import { isTauri } from "./services/codeRunner";
import "./styles.css";

if (!isTauri()) {
    inject();
}

createApp(App).use(router).mount("#app");
