<template>
  <div class="wm-tab-bar wm-tab-bar-safe">
    <div class="wm-tab-bar-position"></div>

    <div class="wm-tab-bar-row">
      <div
        :class="['wm-tab-bar-col', { 'wm-tab-bar-menu': item.type === 'menu' }]"
        v-for="(item, index) in list"
        :key="index"
      >
        <img
          class="wm-tab-bar-image"
          :src="assetsURL + item.iconPath"
          @click="handleClick(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "Tabbar",
  data() {
    return {
      assetsURL,
      list: [
        {
          type: "link",
          pagePath: "/recommend",
          iconPath: "/icon-m01.png",
        },
        {
          type: "link",
          pagePath: "/latest-clue",
          iconPath: "/icon-m02.png",
        },
        {
          type: "menu",
          iconPath: "/icon-menu.png",
        },
        {
          type: "link",
          pagePath: "/best-news",
          iconPath: "/icon-m03.png",
        },
        {
          type: "link",
          pagePath: "/playback",
          iconPath: "/icon-m04.png",
        },
      ],
    };
  },
  methods: {
    handleClick(index) {
      const { type, pagePath } = this.list[index];
      switch (type) {
        case "link":
          this.$emit("link", pagePath);
          break;
        case "menu":
          this.$emit(type);
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 98px;
  background-image: url("https://www.df1668.com/images/bottom-nav-bg.png");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 98px;
}

.wm-tab-bar-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.wm-tab-bar-position {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: env(safe-area-inset-bottom);
  background-color: #fff;
}

.wm-tab-bar-row {
  width: 100%;
  padding: 0 2%;
  box-sizing: border-box;
}

.wm-tab-bar-col {
  display: inline-block;
  width: calc(100% / 5);
  padding-top: 12px;
  vertical-align: top;
}

.wm-tab-bar-col.wm-tab-bar-menu {
  padding-top: 8px;
}

.wm-tab-bar-image {
  display: block;
  margin: 0 auto;
  width: 100px;
  height: 84px;
}

.wm-tab-bar-col.wm-tab-bar-menu .wm-tab-bar-image {
  width: 84px;
}
</style>
