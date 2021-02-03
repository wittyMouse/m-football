<template>
  <div class="wm-playback-tabs">
    <div class="wm-playback-tabs-nav">
      <div class="wm-playback-tabs-nav-list">
        <div
          class="wm-playback-tabs-nav-current"
          :style="{
            transform: `translateX(${currentWidth}px)`,
          }"
        ></div>

        <div
          class="wm-playback-tabs-nav-item"
          v-for="(item, index) in tabList"
          :key="index"
          @click="onClick(item.value)"
        >
          <div class="wm-playback-tabs-tab-cover">
            <img
              class="wm-playback-tabs-tab-cover-image"
              :src="item.itemImage"
            />
          </div>
          <div>{{ item.itemName }}</div>
          <div>{{ item.itemDesc || "" }}</div>
        </div>
      </div>
    </div>

    <div class="wm-playback-tabs-content">
      <div
        class="wm-playback-tabs-content-list"
        :style="{ transform: `translateX(${tabItemWidth}px)` }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlaybackTabs",
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
      tabList: [],
      currentIndex: 0,
    };
  },
  computed: {
    tabWidth() {
      return this.clientWidth * 0.2;
    },
    currentWidth() {
      return (
        this.tabWidth * this.currentIndex +
        (this.tabWidth - this.clientWidth * 0.16) / 2
      );
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
        const { itemDesc, itemImage, itemName } = item.tab;
        return {
          itemDesc,
          itemImage,
          itemName,
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
.wm-playback-tabs-nav {
  background-color: #fff;
}

.wm-playback-tabs-nav-list {
  position: relative;
  display: flex;
}

.wm-playback-tabs-nav-list::after {
  content: " ";
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-bottom: 1px solid #ccc;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-playback-tabs-nav-current {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 16%;
  height: 6px;
  background-color: #e00e00;
  transition: transform 0.3s;
}

.wm-playback-tabs-nav-item {
  position: relative;
  flex: 0 0 auto;
  padding: 12px 0;
  width: 20%;
  font-size: 20px;
  text-align: center;
  line-height: 32px;
  color: #999;
}

.wm-playback-tabs-nav-item:not(:last-child)::after {
  content: " ";
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-right: 1px solid #ccc;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}

.wm-playback-tabs-tab-cover {
  margin: 0 auto 12px;
  width: 60%;
}

.wm-playback-tabs-tab-cover-image {
  display: block;
  width: 100%;
}

.wm-playback-tabs-content {
}

.wm-playback-tabs-content-list {
  display: flex;
  flex-wrap: nowrap;
  transition: transform 0.3s;
}
</style>
