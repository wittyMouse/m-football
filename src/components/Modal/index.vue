<template>
  <div class="modal-wrapper" v-if="visible">
    <div class="modal-mask"></div>
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">{{ config.title || '提示' }}</div>
      </div>
      <div class="modal-content">
        <div class="">
          {{ config.content || '' }}
        </div>
      </div>
      <div class="modal-footer">
        <div class="modal-button" @click="onConfirm">
          {{ config.confirmText || '确定' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    onConfirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
}

.modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal {
  position: fixed;
  top: 50%;
  left: 95px;
  z-index: 2000;
  padding: 16px;
  width: 560px;
  border-radius: 12px;
  box-sizing: border-box;
  background-color: #fff;
  transform: translateY(-50%);
}

.modal-header {
}

.modal-title {
  margin-bottom: 24px;
  border-radius: 12px;
  font-size: 36px;
  text-align: center;
  line-height: 80px;
  color: #fff;
  background-color: #888;
}

.modal-content {
  padding-bottom: 20px;
  font-size: 27px;
  text-align: center;
  color: #666;
  line-height: 1.6;
}

.modal-footer {
}

.modal-button {
  margin: 0 auto;
  width: 60%;
  height: 80px;
  border-radius: 12px;
  font-size: 32px;
  text-align: center;
  color: #fff;
  line-height: 80px;
  background-color: #d00;
}
</style>
