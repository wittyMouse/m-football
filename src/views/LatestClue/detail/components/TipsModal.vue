<template>
  <div class="tips-modal-wrapper" v-if="visible">
    <div class="tips-modal-mask" @click="onClose"></div>
    <div class="tips-modal">
      <div class="tips-modal-header">
        <div class="tips-modal-title">购买提示</div>
      </div>
      <div class="tips-modal-content">
        <div class="">购买该文章需要 {{ dataSource.amount }} 金币</div>
        <div class="">你目前拥有金币：{{ userInfo.balance }} 个</div>
      </div>
      <div class="tips-modal-footer">
        <div class="tips-modal-button" @click="onSubmit">确定购买</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TipsModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    dataSource: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    onClose() {
      this.$emit("close");
    },

    onSubmit() {
      this.$emit("submit");
    },
  },
};
</script>

<style lang="scss" scoped>
.tips-modal-wrapper {
}

.tips-modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1999;
  background-color: rgba(0, 0, 0, 0.7);
}

.tips-modal {
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

.tips-modal-header {
}

.tips-modal-title {
  margin-bottom: 24px;
  border-radius: 12px;
  font-size: 36px;
  text-align: center;
  line-height: 80px;
  color: #fff;
  background-color: #888;
}

.tips-modal-content {
  padding-bottom: 20px;
  font-size: 27px;
  text-align: center;
  color: #666;
  line-height: 1.6;
}

.tips-modal-footer {
}

.tips-modal-button {
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
