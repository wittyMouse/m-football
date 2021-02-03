<template>
  <BasicLayout title="巅峰足球">
    <div class="container tips">
      <div class="scroll-view" ref="scroll">
        <wm-header>提示页</wm-header>

        <div class="tips-content">
          <div class="tips-icon-block">
            <img class="tips-icon" src="../../assets/success.svg" />
          </div>

          <div class="tips-text">
            <div class="tips-title">{{ title }}</div>
            <div class="tips-description">{{ message }}</div>
          </div>

          <div class="tips-button-group">
            <button class="tips-button" @click="onButtonClick('confirm')">
              确定
            </button>
            <button class="tips-button" @click="onButtonClick('cancel')">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </BasicLayout>
</template>

<script>
import BasicLayout from "@/layouts/BasicLayout";
import Header from "@/components/Header";

export default {
  name: "Tips",
  components: {
    BasicLayout,
    "wm-header": Header,
  },
  data() {
    return {
      type: "success",
      title: "操作成功",
      message: "",
    };
  },
  methods: {
    /**
     * 点击确定按钮
     * @param {*} e
     */
    onButtonClick(target) {
      switch (target) {
        case "confirm":
          this.$router.back();
          break;
        case "cancel":
          this.$router.back();
          break;
      }
    },
  },
  mounted() {
    // const { type, title, message } = this.$router.query;
    // if (type) {
    //   this.type = type;
    // }
    const { title, message } = this.$router.query;
    if (title) {
      this.title = title;
    }
    if (message) {
      this.message = message;
    }
  },
};
</script>

<style lang="scss" scoped>
.wm-header {
  font-size: 36px;
  line-height: 80px;
  text-align: center;
  color: #fff;
}

.tips-content {
  padding-top: 72px;
}

.tips-icon-block {
  margin-bottom: 60px;
  text-align: center;
  line-height: 0;
}

.tips-icon {
  width: 208px;
  height: 208px;
}

.tips-text {
  margin-bottom: 50px;
  padding: 0 40px;
  text-align: center;
}

.tips-title {
  font-size: 40px;
  font-weight: 400;
  line-height: 1.6;
}

.tips-description {
  margin-top: 10px;
  font-size: 28px;
  line-height: 1.6;
  color: #888;
}

.tips-button-group {
  padding: 0 30px;
}

.tips-button {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  width: 100% !important;
  height: 84px;
  border-radius: 10px;
  font-size: 36px;
  font-weight: normal;
  text-align: center;
  text-decoration: none;
  line-height: 84px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  color: #454545;
  background-color: #f7f7f7;
}

.tips-button + .tips-button {
  margin-top: 30px;
}

.tips-button:first-child {
  color: #fff;
  background-color: #ee0000;
}

.tips-button::after {
  content: " ";
  display: block;
  position: absolute;
  top: -50%;
  right: -50%;
  bottom: -50%;
  left: -50%;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  pointer-events: none;
  box-sizing: border-box;
}
</style>
