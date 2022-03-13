import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";

import App from "./App.vue";
import router from "./router";
import store from "./store";

// import Vant from "vant";
// import "vant/lib/index.css";
import "./plugins/vant";
import "./assets/style.scss";
import './assets/ck-editor.scss'

import VConsole from "vconsole";

if (import.meta.env.MODE !== "production") {
  new VConsole();
}

Vue.use(VueCompositionAPI);

// Vue.use(Vant);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
