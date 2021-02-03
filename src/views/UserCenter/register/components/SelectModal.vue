<template>
  <div class="select-modal-wrapper" v-show="visible">
    <div class="select-modal-mask" @click="onMaskClick"></div>
    <div class="select-modal">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectModal",
  props: {
    // popup 显示状态
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * 点击遮罩层
     */
    onMaskClick() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.select-modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
}

.select-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 100;
  width: 622px;
  max-height: 900px;
  overflow-x: hidden;
  overflow-y: auto;
  transform: translate(-50%, -50%);
}
</style>
