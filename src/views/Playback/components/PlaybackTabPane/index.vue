<template>
  <div class="wm-playback-tab-pane">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "PlaybackTabPane",
  props: {
    // 选项卡数据
    tab: {
      type: [Object, String],
      default() {
        return {};
      },
    },
    // 对应 activeKey
    value: {
      type: [String, Number],
      default: "",
    },
  },
  created() {
    this.$parent.update();
  },
  destroyed() {
    this.$parent.update();
  },
};
</script>

<style lang="scss" scoped>
.wm-playback-tab-pane {
  flex: 0 0 100%;
}
</style>
