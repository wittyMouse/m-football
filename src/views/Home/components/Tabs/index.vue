<template>
  <div class="wm-tabs">
    <div class="wm-tabs-nav">
      <div class="wm-tabs-nav-list">
        <div
          class="wm-tabs-nav-current"
          :style="{ transform: `translateX(${currentWidth}px)` }"
        >
          <img
            class="wm-tabs-nav-current-image"
            :src="assetsURL + '/icon-jt.png'"
          />
        </div>

        <div
          :class="['ant-tabs-nav-item', { active: activeKey === item.value }]"
          :style="{ width: tabWidth + 'px' }"
          v-for="item in tabList"
          :key="item.value"
          @click="onClick(item.value)"
        >
          {{ item.tab }}
        </div>
      </div>
    </div>

    <div class="wm-tabs-content">
      <div
        class="wm-tabs-content-list"
        :style="{ transform: `translateX(${tabItemWidth}px)` }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { assetsURL } from "@/api/config";

export default {
  name: "Tabs",
  props: {
    // 当前激活 tab 面板的 key
    activeKey: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      clientWidth: 0,
      assetsURL,
      tabList: [],
      currentIndex: 0,
    };
  },
  computed: {
    tabWidth() {
      const len = this.tabList.length;
      if (len > 0) {
        return this.clientWidth / len;
      } else {
        return 0;
      }
    },
    currentWidth() {
      const len = this.tabList.length;
      if (len > 0) {
        return this.tabWidth * this.currentIndex + this.tabWidth / 2;
      } else {
        return 0;
      }
    },
    tabItemWidth() {
      return this.currentIndex * -this.clientWidth;
    },
  },
  watch: {
    activeKey(val) {
      for (let i = 0; i < this.tabList.length; i++) {
        if (this.tabList[i].value === val) {
          this.currentIndex = i;
          break;
        }
      }
    },
  },
  methods: {
    update() {
      const tabList = this.$children.map((item, index) => {
        if (this.activeKey === item.value) {
          this.currentIndex = index;
        }
        return {
          tab: item.tab,
          value: item.value,
        };
      });
      this.tabList = tabList;
    },

    /**
     * 切换 activeKey
     * @param {*} e
     */
    onClick(value) {
      if (this.activeKey !== value) {
        this.$emit("change", value);
      }
    },
  },
  created() {
    this.clientWidth = document.body.clientWidth;
  },
};
</script>

<style lang="scss" scoped>
.wm-tabs {
  width: 100%;
  overflow: hidden;
}

.wm-tabs-nav {
  background-color: #fff;
}

.wm-tabs-nav-list {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
}

.wm-tabs-nav-current {
  position: absolute;
  left: -12px;
  bottom: -14px;
  width: 24px;
  height: 14px;
  z-index: 10;
  transition: transform 0.3s;
}

.wm-tabs-nav-current-image {
  display: block;
  width: 100%;
  height: 100%;
}

.ant-tabs-nav-item {
  padding: 0 13.5px;
  height: 80px;
  font-size: 24px;
  text-align: center;
  line-height: 80px;
  color: #c7000b;
  box-sizing: border-box;
}

.ant-tabs-nav-item.active {
  color: #fff;
  background-color: #c7000b;
}

.wm-tabs-content {
}

.wm-tabs-content-list {
  display: flex;
  flex-wrap: nowrap;
  transition: transform 0.3s;
}
</style>
