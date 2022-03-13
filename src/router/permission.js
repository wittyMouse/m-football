import store from "../store";
import { SET_TOKEN, SET_USER_INFO } from "../store/mutation-types";
import { isWXEnv } from "@/utils";
import { appId } from "@/api/config";
import {
  requestAuxiliaryCheckToken,
  requestRegisterByWechat,
  requestUserInfo,
} from "@/api";
import querystring from "querystring";

function hasAuthToken(to, from, next) {
  if (!store.state.token) {
    // 如果 store 中没有 token，则检查客户端存储中是否存在 token 和 userInfo
    const token = window.localStorage.getItem("token");
    if (token) {
      store.commit(SET_TOKEN, token);
    }
    let userInfo = window.localStorage.getItem("userInfo");
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      store.commit(SET_USER_INFO, userInfo);
    }
  }

  // if (import.meta.env.MODE !== "production") {
  //   next();
  // } else {
  if (!isWXEnv() && to.path !== "/error") {
    // 非微信环境，重定向到错误页
    next("/error");
  } else if (isWXEnv()) {
    console.log('isWXEnv')
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
      // 授权回调页面
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
                          window.sessionStorage.setItem(
                            "register-token",
                            token
                          );
                          window.sessionStorage.setItem(
                            "register-userInfo",
                            JSON.stringify(userInfo)
                          );

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
}

export default function registerRouterGuards(router) {
  router.beforeEach(async (to, from, next) => {
    console.log("to", to);

    if (to.meta && to.meta.requiresAuth) {
      // 需要 authToken 的页面
      const authToken = window.sessionStorage.getItem("auth_token");
      if (authToken) {
        // 有 authToken ,调接口校验
        try {
          const res = await requestAuxiliaryCheckToken({ token: authToken });
          if (res.code === 0) {
            // 校验通过
            hasAuthToken(to, from, next);
          } else {
            // 校验失败
            window.sessionStorage.removeItem("auth_token");
            next("eshop-home");
          }
        } catch (e) {
          // 校验失败
          window.sessionStorage.removeItem("auth_token");
          next("eshop-home");
        }
      } else {
        // 没有 authToken ,跳转电商
        next("eshop-home");
      }
    } else {
      // 不需要 authToken 的页面
      next();
    }
  });
}
