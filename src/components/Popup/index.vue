<template>
  <div class="wm-popup-wrapper">
    <div
      :class="['wm-popup-mask', { hidden: !visible }]"
      @click="onMaskClick"
      v-if="mask"
    ></div>
    <div
      :class="['wm-popup', { 'wm-popup-safe': safe }, { show: visible }]"
      @transitionend="onTransitionend"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popup",
  props: {
    // popup 显示状态
    visible: {
      type: Boolean,
      default: false,
    },
    // 遮罩显示状态
    mask: {
      type: Boolean,
      default: true,
    },
    // iOS 底部安全区域
    safe: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    /**
     * 点击遮罩层
     */
    onMaskClick() {
      this.$emit("close");
    },

    /**
     * popup 动画结束
     */
    onTransitionend() {
      if (!this.visible) {
        this.$emit("closed");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wm-popup {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transform: translateY(100%);
  backface-visibility: hidden;
  background-color: #fff;
  transition: transform 0.3s;
  overflow: hidden;
}

.wm-popup.show {
  transform: translate(0);
}

.wm-popup-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.wm-popup-mask {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
  opacity: 1;
  transform: scale3d(1, 1, 1);
  transition: all 0.3s;
  background-color: rgba(0, 0, 0, 0.6);
}

.wm-popup-mask.hidden {
  opacity: 0;
  transform: scale3d(1, 1, 0);
}
</style>
