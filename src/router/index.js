import Vue from "vue";
import store from "../store";
import VueRouter from "vue-router";
import Home from "../views/Home";
import { isWXEnv } from "@/utils";
import { appId } from "@/api/config";
import { requestRegisterByWechat, requestUserInfo } from "@/api";
import querystring from "querystring";

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
    path: "/user-center/index",
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
  // console.log("to", to);
  if (!store.state.token) {
    // 如果 store 中没有 token，则检查客户端存储中是否存在 token 和 userInfo
    const token = window.localStorage.getItem("token");
    if (token) {
      store.commit("SET_TOKEN", token);
    }
    let userInfo = window.localStorage.getItem("userInfo");
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      store.commit("SET_USER_INFO", userInfo);
    }
  }

  // if (process.env.NODE_ENV !== "production") {
  //   next();
  // } else {
  if (!isWXEnv() && to.path !== "/error") {
    // 非微信环境，重定向到错误页
    next("/error");
  } else if (isWXEnv()) {
    // 微信环境
    if (to.path === "/error") {
      // 错误页重定向到首页
      next("/home");
    } else if (to.path === "/user-center/recharge") {
      // 充值页面
      const openId = window.sessionStorage.getItem("openId");
      const code = window.sessionStorage.getItem("code");
      if (!openId && !code) {
        const { origin, pathname } = window.location;
        const redirectUri = origin + pathname;
        const callbackUrl = to.fullPath;
        const stateText = `url=${callbackUrl}&target=recharge`;
        let state = "";
        for (let i = 0; i < stateText.length; i++) {
          state += stateText.charCodeAt(i).toString(16);
        }
        console.log("state-length: ", state.length);
        const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
        window.location.href = authUrl;
      } else {
        next();
      }
    }
    // else if (to.path === "/user-center/register") {
    //   // 注册页面
    //   const openId = window.sessionStorage.getItem("openId");
    //   const code = window.sessionStorage.getItem("code");
    //   if (!openId && !code) {
    //     const { origin, pathname } = window.location;
    //     const redirectUri = origin + pathname;
    //     const callbackUrl = to.fullPath;
    //     const stateText = `url=${callbackUrl}&target=register`;
    //     let state = "";
    //     for (let i = 0; i < stateText.length; i++) {
    //       state += stateText.charCodeAt(i).toString(16);
    //     }
    //     console.log("state-length: ", state.length);
    //     const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(
    //       redirectUri
    //     )}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    //     window.location.href = authUrl;
    //   } else {
    //     next();
    //   }
    // }
    else {
      const { origin, pathname, search } = window.location;
      if (search) {
        const { code, state } = querystring.parse(search.replace("?", ""));
        if (code) {
          const { url, target } = querystring.parse(
            state
              .match(/[\d\w]{2}/g)
              .map((item) => String.fromCharCode(parseInt(item, 16)))
              .join("")
          );
          window.sessionStorage.setItem("code", code);
          window.sessionStorage.setItem("target", target);
          window.location.href = `${origin}${pathname}#${url}`;
        } else {
          next();
        }
      } else {
        // 登录
        const code = window.sessionStorage.getItem("code");
        const target = window.sessionStorage.getItem("target");
        if (code && target) {
          if (target === "login") {
            const data = { code, type: 1 };
            requestRegisterByWechat(data)
              .then((res) => {
                if (res.code === 0) {
                  const token = res.result;
                  requestUserInfo({ token })
                    .then((res) => {
                      if (res.code === 0) {
                        const userInfo = res.result;
                        // store.dispatch("updateUserInfo", userInfo);
                        if (!userInfo.mobile) {
                          // 没有绑定手机号
                          window.sessionStorage.setItem('register-token', token)
                          window.sessionStorage.setItem('register-userInfo', JSON.stringify(userInfo))
                          
                          next("/user-center/register");
                        } else {
                          store.dispatch("updateToken", token);
                          store.dispatch("updateUserInfo", userInfo);
                          next();
                        }
                      } else {
                        store.dispatch("logout");
                        next();
                      }
                    })
                    .catch(() => {
                      store.dispatch("logout");
                      next();
                    });
                } else {
                  const modalConfig = {
                    title: "提示",
                    content: res.message,
                    confirmText: "确定",
                  };
                  store.dispatch("updateModalConfig", modalConfig);
                  store.dispatch("updateModalVisible", true);
                  next();
                }
              })
              .catch(() => {
                next();
              })
              .finally(() => {
                window.sessionStorage.removeItem("code");
                window.sessionStorage.removeItem("target");
              });
          } else {
            next();
          }
        } else {
          next();
        }
      }
    }
  } else {
    next();
  }
  // }
});

export default router;
