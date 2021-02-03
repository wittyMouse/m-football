<template>
  <div class="wm-float-button-group">
    <div class="wm-float-button-group__button" @click="onClick('wechat')">
      <img
        class="wm-float-button-group__image"
        :src="assetsURL + '/icon-r01.png'"
      />
    </div>
    <div class="wm-float-button-group__button">
      <a class="wm-float-button-group__link" :href="'tel:' + phoneNumber">
        <img
          class="wm-float-button-group__image"
          :src="assetsURL + '/icon-r02.png'"
        />
      </a>
    </div>
    <div class="wm-float-button-group__button" @click="onClick('car')">
      <img
        class="wm-float-button-group__image"
        :src="assetsURL + '/icon-r03.png'"
      />
    </div>
    <div class="wm-float-button-group__button" @click="onClick('top')">
      <img
        class="wm-float-button-group__image"
        :src="assetsURL + '/icon-r04.png'"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import PreviewImage from "@/components/PreviewImage";
import { assetsURL } from "@/api/config";

export default {
  name: "FloatButtonGroup",
  data() {
    return {
      assetsURL,
      phoneNumber: "4000001357",
    };
  },
  methods: {
    /**
     * 点击图标
     * @param {*} e
     */
    onClick(target) {
      if (target === "wechat") {
        const PreviewImageComponent = Vue.extend(PreviewImage);
        const previewImageComponent = new PreviewImageComponent().$mount();
        document.querySelector("#app").appendChild(previewImageComponent.$el);
      }
      this.$emit(target);
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-float-button-group {
  position: fixed;
  bottom: 15%;
  right: 8px;
  z-index: 10;
  padding-top: 8px;
  width: 88px;
  border-radius: 44px;
  background-color: rgba(0, 0, 0, 0.3);
}

.wm-float-button-group__button {
  margin: 0 auto 8px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #fff;
}

.wm-float-button-group__link {
}

.wm-float-button-group__image {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
