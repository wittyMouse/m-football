import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/vant";
import "./assets/style.scss";
import './assets/ck-editor.scss'

if (process.env.NODE_ENV !== "production") {
  const VConsole = require("vconsole");
  new VConsole();
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
