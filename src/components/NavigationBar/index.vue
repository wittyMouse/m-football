<template>
  <div class="wm-navigation-bar">
    <div class="wm-navigation-bar-back" v-if="showBack">
      <img
        class="wm-navigation-bar-back-image"
        :src="assetsURL + '/icon-back.png'"
        @click="onClick('back')"
      />
    </div>
    <div class="wm-navigation-bar-logo" v-else>
      <img
        class="wm-navigation-bar-logo-image"
        :src="assetsURL + '/logo.png'"
        @click="onClick('logo')"
      />
    </div>

    <div class="wm-navigation-bar-title">{{ title }}</div>

    <div class="wm-navigation-bar-logo" v-if="showBack">
      <img
        class="wm-navigation-bar-logo-image"
        :src="assetsURL + '/logo.png'"
        @click="onClick('logo')"
      />
    </div>
    <div class="wm-navigation-bar-car" v-else>
      <img
        class="wm-navigation-bar-car-image"
        :src="assetsURL + '/icon-cart.png'"
        @click="onClick('car')"
      />
    </div>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "NavigationBar",
  props: {
    title: {
      type: String,
      default: "",
    },
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      assetsURL,
    };
  },
  methods: {
    // 点击图标
    onClick(target) {
      this.$emit(target);
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-navigation-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100px;
  background-image: url("https://www.df1668.com/images/top-nav-bg.png");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100px;
}

.wm-navigation-bar-title {
  display: inline-block;
  width: 502px;
  font-size: 36px;
  text-align: center;
  line-height: 80px;
  vertical-align: top;
}

.wm-navigation-bar-logo,
.wm-navigation-bar-back,
.wm-navigation-bar-car {
  display: inline-block;
  width: 124px;
  vertical-align: top;
}

.wm-navigation-bar-logo .wm-navigation-bar-logo-image {
  display: block;
  width: 108px;
  height: 88px;
  margin-left: 14px;
  margin-top: 4px;
}

.wm-navigation-bar-back .wm-navigation-bar-back-image,
.wm-navigation-bar-car .wm-navigation-bar-car-image {
  display: block;
  margin: 10px 0 0 24px;
  width: 80px;
  height: 80px;
}
</style>
