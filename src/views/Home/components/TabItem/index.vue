<template>
  <div class="wm-tab-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabItem",
  props: {
    // 选项卡数据
    tab: {
      type: String,
      default: "",
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
.wm-tab-item {
  flex: 0 0 100%;
  box-shadow: 0 0 12px #d0d0d0;
}
</style>
