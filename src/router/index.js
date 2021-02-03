import Vue from "vue";
import store from "../store";
import VueRouter from "vue-router";
import Home from "../views/Home";
import { isWXEnv, parseQueryString } from "@/utils";
import { appId } from '@/api/config'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/recommend",
    name: "Recommend",
    component: () => import("../views/Recommend"),
  },
  {
    path: "/recommend/detail",
    name: "RecommendDetail",
    component: () => import("../views/Recommend/detail"),
  },
  {
    path: "/latest-clue",
    name: "LatestClue",
    component: () => import("../views/LatestClue"),
  },
  {
    path: "/latest-clue/detail",
    name: "LatestClueDetail",
    component: () => import("../views/LatestClue/detail"),
  },
  {
    path: "/latest-clue/profile",
    name: "LatestClueProfile",
    component: () => import("../views/LatestClue/profile"),
  },
  {
    path: "/best-news",
    name: "BestNews",
    component: () => import("../views/BestNews"),
  },
  {
    path: "/playback",
    name: "Playback",
    component: () => import("../views/Playback"),
  },
  {
    path: "/user-center",
    name: "UserCenter",
    component: () => import("../views/UserCenter"),
  },
  {
    path: "/user-center/modify",
    name: "UserCenterModify",
    component: () => import("../views/UserCenter/modify"),
  },
  {
    path: "/user-center/recharge",
    name: "UserCenterRecharge",
    component: () => import("../views/UserCenter/recharge"),
  },
  {
    path: "/user-center/record",
    name: "UserCenterRecord",
    component: () => import("../views/UserCenter/record"),
  },
  {
    path: "/user-center/register",
    name: "UserCenterRegister",
    component: () => import("../views/UserCenter/register"),
  },
  {
    path: "/tips",
    name: "Tips",
    component: () => import("../views/Tips"),
  },
  {
    path: "/shop-car",
    name: "ShopCar",
    component: () => import("../views/ShopCar"),
  },
  {
    path: "/error",
    name: "Error",
    component: () => import("../views/Error"),
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  if (!store.state.token) {
    const token = window.localStorage.getItem("token");
    if (token) {
      const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      store.commit("SET_TOKEN", token);
      store.commit("SET_USER_INFO", userInfo);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    next();
  } else {
    if (!isWXEnv() && to.path !== "/error") {
      next("/error");
    } else if (isWXEnv()) {
      if (to.path === "/error") {
        next("/home");
      } else if (to.path === '/user-center/recharge') {
        const openId = window.sessionStorage.getItem('openId')
        const code = window.sessionStorage.getItem('code')
        if (!openId && !code) {
          const redirectUri = location.href.split("#")[0];
          const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_base#wechat_redirect`;
          window.location.href = authUrl;
        } else {
          next();
        }
      } else {
        const { origin, pathname, search } = window.location;
        if (search) {
          const { code } = parseQueryString(search);
          if (code) {
            window.sessionStorage.setItem('code', code)
            window.location.href = origin + pathname + '#/user-center/recharge'
          } else {
            next();
          }
        } else {
          next();
        }
      }
    } else {
      next();
    }
  }
});

export default router;
