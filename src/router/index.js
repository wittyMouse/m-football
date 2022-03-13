import Vue from "vue";
import VueRouter from "vue-router";
import registerRouterGuards from "./permission";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/bootstrap",
    name: "Bootstrap",
    component: () => import("../views/Bootstrap/index.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/recommend",
    name: "Recommend",
    component: () => import("../views/Recommend/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/recommend/detail",
    name: "RecommendDetail",
    component: () => import("../views/Recommend/detail/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/latest-clue",
    name: "LatestClue",
    component: () => import("../views/LatestClue/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/latest-clue/detail",
    name: "LatestClueDetail",
    component: () => import("../views/LatestClue/detail/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/latest-clue/profile",
    name: "LatestClueProfile",
    component: () => import("../views/LatestClue/profile/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/best-news",
    name: "BestNews",
    component: () => import("../views/BestNews/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/playback",
    name: "Playback",
    component: () => import("../views/Playback/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/user-center/index",
    name: "UserCenter",
    component: () => import("../views/UserCenter/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/user-center/modify",
    name: "UserCenterModify",
    component: () => import("../views/UserCenter/modify/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/user-center/recharge",
    name: "UserCenterRecharge",
    component: () => import("../views/UserCenter/recharge/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/user-center/record",
    name: "UserCenterRecord",
    component: () => import("../views/UserCenter/record/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/user-center/register",
    name: "UserCenterRegister",
    component: () => import("../views/UserCenter/register/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/tips",
    name: "Tips",
    component: () => import("../views/Tips/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/shop-car",
    name: "ShopCar",
    component: () => import("../views/ShopCar/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/error",
    name: "Error",
    component: () => import("../views/Error/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/eshop-home",
    name: "EShopHome",
    component: () => import("../views/EShopHome/index.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  routes,
});

export function useRouter() {
  return router;
}

registerRouterGuards(router);

export default router;
