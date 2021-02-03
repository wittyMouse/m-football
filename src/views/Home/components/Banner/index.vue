<template>
  <div class="wm-banner">
    <div class="wm-banner-indicator-dots" v-show="bannerList.length > 1">
      <div
        :class="[
          'wm-banner-indicator-dots-item',
          { active: current === index },
        ]"
        v-for="(item, index) in bannerList"
        :key="item.id"
      ></div>
    </div>

    <div
      class="wm-banner-button-prev"
      @click="onClick('prev')"
      v-show="bannerList.length > 1"
    ></div>
    <div
      class="wm-banner-button-next"
      @click="onClick('next')"
      v-show="bannerList.length > 1"
    ></div>

    <div
      class="wm-banner-swiper"
      :style="{ transform: `translateX(${swiperWidth}px)` }"
    >
      <div
        class="wm-banner-swiper-item"
        v-for="(item, index) in bannerList"
        :key="item.id"
      >
        <img
          class="wm-banner-swiper-image"
          :src="item.imageUrl"
          @click="onBannerClick(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "Banner",
  props: {
    bannerList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      assetsURL,

      clientWidth: 0,

      // 当前所在滑块的 index
      current: 0,

      // 自动切换
      autoplay: true,

      // 定时器 id
      timer: "",

      interval: 5000,
    };
  },
  computed: {
    swiperWidth() {
      if (this.current > 0) {
        return -this.current * this.clientWidth;
      } else {
        return 0;
      }
    },
  },
  watch: {
    bannerList(list) {
      if (list.length > 1) {
        if (!this.timer) {
          this.startTimer();
        }
      } else {
        if (this.timer) {
          this.stopTimer();
        }
      }
    },
  },
  methods: {
    /**
     * 点击切换按钮
     * @param {*} e
     */
    onClick(type) {
      // 防止定时器和 autoplay 同时切换 current
      this.stopTimer();

      let _current = 0;
      const maxIndex = this.bannerList.length - 1;
      switch (type) {
        case "prev":
          _current = this.current !== 0 ? this.current - 1 : maxIndex;
          break;
        case "next":
          _current = this.current !== maxIndex ? this.current + 1 : 0;
          break;
      }

      this.current = _current;
      this.startTimer();
    },

    /**
     * 点击 banner 图
     * @param {*} e
     */
    onBannerClick(index) {
      const url = this.bannerList[index].pageUrl;
      if (url) {
        window.location.href = url;
      }
    },

    startTimer() {
      this.timer = setInterval(() => {
        const max = this.bannerList.length - 1;
        if (this.current < max) {
          this.current = this.current + 1;
        } else [(this.current = 0)];
      }, this.interval);
    },

    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = "";
      }
    },
  },
  created() {
    this.clientWidth = document.body.clientWidth;
  },
  mounted() {
    if (this.bannerList.length > 1) {
      this.startTimer();
    }
  },
  destroyed() {
    this.stopTimer();
  },
};
</script>

<style lang="scss" scoped>
.wm-banner {
  position: relative;
  padding-top: 40px;
  width: 100%;
  height: 480px;
}

.wm-banner-indicator-dots {
  position: absolute;
  top: -4px;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
}

.wm-banner-indicator-dots-item {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  vertical-align: middle;
  background-color: #999;
}

.wm-banner-indicator-dots-item + .wm-banner-indicator-dots-item {
  margin-left: 8px;
}

.wm-banner-indicator-dots-item.active {
  background-color: #d9260a;
}

.wm-banner-button-prev,
.wm-banner-button-next {
  position: absolute;
  top: 50%;
  z-index: 10;
  width: 40px;
  height: 64px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 40px 64px;
  transform: translateY(-12px);
}

.wm-banner-button-prev {
  left: 20px;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}

.wm-banner-button-next {
  right: 20px;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}

.wm-banner-swiper {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  transition: 0.5s;
}

.wm-banner-swiper-item {
  flex: 0 0 auto;
  width: 100%;
  height: 100%;
}

.wm-banner-swiper-image {
  width: 100%;
  height: 100%;
}
</style>
